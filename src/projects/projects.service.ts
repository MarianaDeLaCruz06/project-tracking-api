import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Status } from '../status/entities/status.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Status) private readonly statusRepo: Repository<Status>,
  ) {}

  async create(dto: CreateProjectDto) {
    if (dto.startDate > dto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const status = await this.statusRepo.findOne({ where: { id: dto.statusId } });
    if (!status) throw new BadRequestException('Invalid status');

    const parentProject = dto.parentId
      ? await this.projectRepo.findOne({ where: { id: dto.parentId } })
      : null;

    if (dto.parentId) {
      if (!parentProject) throw new BadRequestException('Parent project not found');
      if (parentProject.type !== 'macro') {
        throw new BadRequestException('Parent project must be of type "macro"');
      }
    }

    const projectData: Partial<Project> = {
      ...dto,
      status,
    };

    if (parentProject) {
      projectData.parent = parentProject;
    }

    const project = this.projectRepo.create(projectData);
    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({ relations: ['tasks', 'children', 'parent', 'status'] });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['tasks', 'children', 'parent', 'status'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.findOne(id);

    if (dto.startDate && dto.endDate && dto.startDate > dto.endDate) {
      throw new BadRequestException('End date must be after start date');
    }

    if (dto.statusId) {
      const status = await this.statusRepo.findOne({ where: { id: dto.statusId } });
      if (!status) throw new BadRequestException('Invalid status');

      if (status.name === 'Completed') {
        const incompleteTasks = project.tasks.filter(
          (task) => task.status.name !== 'Completed',
        );
        if (incompleteTasks.length > 0) {
          throw new BadRequestException(
            'Cannot mark project as Completed while tasks are not completed',
          );
        }
      }

      project.status = status;
    }

    const parentProject = dto.parentId
      ? await this.projectRepo.findOne({ where: { id: dto.parentId } })
      : null;

    if (dto.parentId) {
      if (!parentProject) throw new BadRequestException('Parent project not found');
      if (parentProject.type !== 'macro') {
        throw new BadRequestException('Parent project must be of type "macro"');
      }
      project.parent = parentProject;
    }

    Object.assign(project, dto);
    return this.projectRepo.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);
    return this.projectRepo.remove(project);
  }
}
