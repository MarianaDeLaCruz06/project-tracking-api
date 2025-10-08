import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectParticipant } from '../../project-participants/entities/project-participant.entity';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => ProjectParticipant, (pp) => pp.participant)
  projectParticipants: ProjectParticipant[];
}
