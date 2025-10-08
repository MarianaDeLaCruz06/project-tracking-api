import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectParticipant } from './entities/project-participant.entity';
import { CreateProjectParticipantDto } from './dto/create-project-participant.dto';
import { UpdateProjectParticipantDto } from './dto/update-project-participant.dto';
import { Project } from '../projects/entities/project.entity';
import { Participant } from '../participants/entities/participant.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class ProjectParticipantsService {
  constructor(
    @InjectRepository(ProjectParticipant)
    private readonly ppRepo: Repository<ProjectParticipant>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async create(dto: CreateProjectParticipantDto) {
    const project = await this.projectRepo.findOne({ where: { id: dto.projectId } });
    if (!project) throw new BadRequestException('Project not found');

    const participant = await this.participantRepo.findOne({ where: { id: dto.participantId } });
    if (!participant) throw new BadRequestException('Participant not found');

    const role = await this.roleRepo.findOne({ where: { id: dto.roleId } });
    if (!role) throw new BadRequestException('Role not found');

    // Regla: evitar duplicado mismo rol y proyecto
    const existing = await this.ppRepo.findOne({
      where: { project: { id: project.id }, participant: { id: participant.id }, role: { id: role.id } },
    });
    if (existing) {
      throw new BadRequestException('Participant already has this role in the project');
    }

    const pp = this.ppRepo.create({ project, participant, role });
    return this.ppRepo.save(pp);
  }

  findAll() {
    return this.ppRepo.find({ relations: ['project', 'participant', 'role'] });
  }

  async findOne(id: number) {
    const pp = await this.ppRepo.findOne({ where: { id }, relations: ['project', 'participant', 'role'] });
    if (!pp) throw new NotFoundException('ProjectParticipant not found');
    return pp;
  }

  async update(id: number, dto: UpdateProjectParticipantDto) {
    const pp = await this.findOne(id);
    Object.assign(pp, dto);
    return this.ppRepo.save(pp);
  }

  async remove(id: number) {
    const pp = await this.findOne(id);
    return this.ppRepo.remove(pp);
  }
}
