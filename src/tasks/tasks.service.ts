import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from '../projects/entities/project.entity';
import { Status } from '../status/entities/status.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Status) private readonly statusRepo: Repository<Status>,
  ) {}

  async create(dto: CreateTaskDto) {
    const project = await this.projectRepo.findOne({ where: { id: dto.projectId }, relations: ['tasks'] });
    if (!project) throw new BadRequestException('Project not found');

    if (dto.startDate && dto.endDate && dto.startDate > dto.endDate) {
      throw new BadRequestException('Task end date must be after start date');
    }

    const status = await this.statusRepo.findOne({ where: { id: dto.statusId } });
    if (!status) throw new BadRequestException('Invalid status');

    const task = this.taskRepo.create({
      ...dto,
      project,
      status,
    });
    return this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find({ relations: ['project', 'status'] });
  }

  async findOne(id: number) {
    const task = await this.taskRepo.findOne({ where: { id }, relations: ['project', 'status'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(id);

    if (dto.startDate && dto.endDate && dto.startDate > dto.endDate) {
      throw new BadRequestException('Task end date must be after start date');
    }

    if (dto.statusId) {
      const status = await this.statusRepo.findOne({ where: { id: dto.statusId } });
      if (!status) throw new BadRequestException('Invalid status');
      task.status = status;
    }

    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    return this.taskRepo.remove(task);
  }
}
