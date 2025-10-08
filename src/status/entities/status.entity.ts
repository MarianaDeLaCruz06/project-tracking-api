import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // ejemplo: "Pending", "In Progress", "Completed"

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];

  @OneToMany(() => Project, (project) => project.status)
  projects: Project[];
}
