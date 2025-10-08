import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Status } from '../../status/entities/status.entity';

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

  @ManyToOne(() => Status, (status) => status.projects, { eager: true })
  status: Status; // <--- ahora es relación

  @Column({ type: 'varchar', default: 'normal' })
  type: string; // "macro" o "sub"

  @ManyToOne(() => Project, (project) => project.children, { nullable: true })
  parent?: Project;

  @OneToMany(() => Project, (project) => project.parent)
  children: Project[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
