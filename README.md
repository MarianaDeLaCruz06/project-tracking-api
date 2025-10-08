

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## 🧭 1️⃣ Crear el proyecto NestJS desde Git Bash o VS Code

Abre tu terminal (puede ser Git Bash o el terminal integrado de VS Code) y escribe:

```bash
# 📂 1. Moverte al escritorio
cd ~/desktop

# 🚀 2. Crear un nuevo proyecto NestJS
npx @nestjs/cli new project-tracking-api

# 👉 Cuando te pregunte el gestor de paquetes, elige: npm
```

Esto creará una carpeta llamada `project-tracking-api` con la estructura base de NestJS.

---

## ⚙️ 2️⃣ Entrar al proyecto y ejecutar por primera vez

```bash
cd project-tracking-api
npm run start:dev
```

> ✅ Si todo sale bien, verás en consola algo como:
>
> ```
> Nest application successfully started
> ```

---

## 🧩 3️⃣ Instalar TypeORM + PostgreSQL + dotenv

Ejecuta:

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config
```

Esto instala:

* `typeorm` → ORM principal
* `pg` → driver de PostgreSQL
* `@nestjs/config` → para variables de entorno (`.env`)

---

## 🗄️ 4️⃣ Crear la base de datos en PostgreSQL

Abre Git Bash y ejecuta `psql`:

```bash
psql -U postgres
```

(si te pide contraseña, pon la que configuraste al instalar PostgreSQL).

Luego crea la base de datos:

```sql
CREATE DATABASE project_tracking;
\q
```

---

## 🔑 5️⃣ Crear archivo `.env` en la raíz del proyecto

Crea un archivo llamado `.env` en la raíz del proyecto (`project-tracking-api/.env`) con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_aquí
DB_NAME=project_tracking
```

---

## 🧠 6️⃣ Configurar conexión en `app.module.ts`

Abre el archivo `src/app.module.ts` y reemplázalo por esto:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importaremos los módulos más adelante
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
```

---

## 🧱 7️⃣ Crear módulos y entidades

Ahora, crea los módulos y entidades base (solo estructura al inicio):

```bash
# Módulos principales
nest g module projects
nest g module participants
nest g module roles
nest g module tasks
nest g module project-participants
nest g module status

# Servicios y controladores
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

## 🧩 8️⃣ Crear entidades (por ejemplo `Project`)

Dentro de `src/projects/entities/project.entity.ts`:

```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TaskTracking } from '../../tasks/entities/task-tracking.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  status_id?: number;

  @Column({ nullable: true })
  parent_id?: number;

  @OneToMany(() => TaskTracking, (task) => task.project)
  tasks: TaskTracking[];
}
```

👉 Luego harás lo mismo para las otras entidades (`participants`, `roles`, `task_tracking`, `status`, `project_participants`).

---

## ⚙️ 9️⃣ Probar la conexión

Ejecuta el proyecto:

```bash
npm run start:dev
```

En consola deberías ver algo así:

```
[Nest] 4564   - Started Nest application
Query: CREATE TABLE "projects" ...
```

Esto significa que TypeORM se conectó correctamente y generó las tablas en tu base de datos PostgreSQL 🥳

---

## ✅ 10️⃣ Verificar en PostgreSQL

Vuelve a entrar a `psql`:

```bash
psql -U postgres -d project_tracking
```

y ejecuta:

```sql
\dt
```

Deberías ver las tablas creadas por TypeORM (como `projects`).


