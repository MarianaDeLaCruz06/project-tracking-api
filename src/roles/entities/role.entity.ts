import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectParticipant } from '../../project-participants/entities/project-participant.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // ejemplo: "Developer", "Manager", "Tester"

  @OneToMany(() => ProjectParticipant, (pp) => pp.role)
  projectParticipants: ProjectParticipant[];
}
