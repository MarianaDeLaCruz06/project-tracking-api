import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectParticipantsService } from './project-participants.service';
import { ProjectParticipantsController } from './project-participants.controller';
import { ProjectParticipant } from './entities/project-participant.entity';
import { Project } from '../projects/entities/project.entity';
import { Participant } from '../participants/entities/participant.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectParticipant, Project, Participant, Role])],
  controllers: [ProjectParticipantsController],
  providers: [ProjectParticipantsService],
  exports: [TypeOrmModule],
})
export class ProjectParticipantsModule {}
