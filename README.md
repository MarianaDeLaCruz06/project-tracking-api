
# **Project Tracking API**

## **Description**

Este proyecto es una API para gestionar proyectos, participantes, roles, tareas y estados, desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**.
Permite la creación, lectura, actualización y eliminación (CRUD) de todas las entidades, cumpliendo reglas de negocio como:

1. Un proyecto solo puede tener como padre a un proyecto de tipo “macro”.
2. Un participante no puede estar asignado dos veces al mismo proyecto con el mismo rol, pero puede tener varios roles en el mismo proyecto.
3. El estado de una tarea solo puede ser “Pending”, “In Progress” o “Completed”.
4. La fecha de finalización de un proyecto debe ser posterior a la fecha de inicio.
5. Un proyecto no puede marcarse como “Completed” si aún existen tareas en estado distinto de “Completed”.

### Repo profe (*https://github.com/leobusar/icesi-2025b-nestjs*)

---

## **Project setup**

### 1️⃣ Clonar el repositorio e instalar dependencias

```bash
git clone https://github.com/MarianaDeLaCruz06/project-tracking-api.git
cd project-tracking-api
npm install
```

### 2️⃣ Instalaciones adicionales necesarias

```bash
# TypeORM y PostgreSQL
npm install @nestjs/typeorm typeorm pg

# Configuración de variables de entorno
npm install @nestjs/config

# Validación de DTOs
npm install class-validator class-transformer
```

---

## **Database setup**

1. Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE project_tracking;
```

2. Crear archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña(mari1234)
DB_NAME=project_tracking
```

3. Configurar la conexión en `src/app.module.ts`:

```ts
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Solo usar en desarrollo
    }),
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
```

---

## **Modules & Entities**

El proyecto contiene los siguientes módulos y entidades:

| Módulo                 | Entidad              | Descripción                                     |
| ---------------------- | -------------------- | ----------------------------------------------- |
| `projects`             | `Project`            | Gestiona los proyectos y su jerarquía           |
| `participants`         | `Participant`        | Gestiona los participantes                      |
| `roles`                | `Role`               | Roles de los participantes en los proyectos     |
| `tasks`                | `Task`               | Tareas asociadas a proyectos                    |
| `project-participants` | `ProjectParticipant` | Relación entre proyectos, participantes y roles |
| `status`               | `Status`             | Estados que pueden tener proyectos y tareas     |

---

## **Creating modules, services, and controllers**

Ejemplo de creación para todos los módulos:

```bash
# Crear módulos
nest g module projects
nest g module participants
nest g module roles
nest g module tasks
nest g module project-participants
nest g module status

# Crear servicios y controladores (sin archivos .spec)
nest g service projects --no-spec
nest g controller projects --no-spec

nest g service participants --no-spec
nest g controller participants --no-spec

nest g service roles --no-spec
nest g controller roles --no-spec

nest g service tasks --no-spec
nest g controller tasks --no-spec

nest g service project-participants --no-spec
nest g controller project-participants --no-spec

nest g service status --no-spec
nest g controller status --no-spec
```

---

## **Entities examples**

### **Project Entity**

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'varchar', default: 'normal' })
  type: string; // macro o sub

  @Column({ type: 'varchar', default: 'Pending' })
  status: string;

  @ManyToOne(() => Project, (project) => project.children, { nullable: true })
  parent?: Project;

  @OneToMany(() => Project, (project) => project.parent)
  children: Project[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
```

### **Task Entity**

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', default: 'Pending' })
  status: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  endDate?: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  project: Project;
}
```

---

## **Run the project**

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production
npm run start:prod
```

* Verifica que TypeORM genere las tablas en PostgreSQL.
* Puedes entrar a `psql` y usar `\dt` para ver las tablas creadas.

---

## **Testing**

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## **API Endpoints básicos**

| Módulo       | Método | Endpoint      | Descripción                |
| ------------ | ------ | ------------- | -------------------------- |
| Projects     | GET    | /projects     | Listar todos los proyectos |
| Projects     | POST   | /projects     | Crear proyecto             |
| Tasks        | GET    | /tasks        | Listar tareas              |
| Tasks        | POST   | /tasks        | Crear tarea                |
| Participants | GET    | /participants | Listar participantes       |
| Roles        | GET    | /roles        | Listar roles               |
| Status       | GET    | /status       | Listar estados             |

> Para los endpoints CRUD completos de cada módulo, se siguen las mismas convenciones.


---

## **🔍 Acceder y revisar la base de datos**

### 1️⃣ Entrar a PostgreSQL

Abre tu terminal (Git Bash, CMD o PowerShell) y escribe:

```bash
psql -U postgres
```

* `-U postgres` indica que te conectas con el usuario `postgres`.
* Si tu usuario o contraseña son distintos, reemplaza según corresponda.
* PostgreSQL pedirá tu contraseña.

---

### 2️⃣ Conectarse a la base de datos del proyecto

```sql
\c project_tracking
```

* `project_tracking` es el nombre de la base de datos que creaste.

---

### 3️⃣ Listar las tablas creadas por TypeORM

```sql
\dt
```

Esto mostrará todas las tablas como:

```
public | projects
public | participants
public | roles
public | tasks
public | project_participants
public | status
```

---

### 4️⃣ Ver el contenido de una tabla

Por ejemplo, para ver los proyectos creados:

```sql
SELECT * FROM projects;
```

Para las tareas:

```sql
SELECT * FROM tasks;
```

---

### 5️⃣ Salir de PostgreSQL

```sql
\q
```




