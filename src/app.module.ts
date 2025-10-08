import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProjectsModule } from './projects/projects.module';
import { ParticipantsModule } from './participants/participants.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectParticipantsModule } from './project-participants/project-participants.module';
import { StatusModule } from './status/status.module';


@Module({
  imports: [
    // 🌱 Cargar variables .env
    ConfigModule.forRoot({ isGlobal: true }),

    // 🧩 Conexión con PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Carga automática de entidades
      synchronize: true,      // ⚠️ Solo usar en desarrollo
    }),

    // Aquí irán tus módulos
    ProjectsModule,
    ParticipantsModule,
    RolesModule,
    TasksModule,
    ProjectParticipantsModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
