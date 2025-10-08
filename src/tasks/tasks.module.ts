import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectsModule } from '../projects/projects.module';
import { Status } from 'src/status/entities/status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Project, Status]),
    ProjectsModule, // 👈 IMPORTANTE: permite usar el repositorio de Project
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TypeOrmModule],
})
export class TasksModule {}
