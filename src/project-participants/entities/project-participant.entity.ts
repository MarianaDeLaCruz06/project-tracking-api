import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Participant } from '../../participants/entities/participant.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity()
@Unique(['project', 'participant', 'role'])
export class ProjectParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
  project: Project;

  @ManyToOne(() => Participant, (participant) => participant.projectParticipants, { onDelete: 'CASCADE' })
  participant: Participant;

  @ManyToOne(() => Role, (role) => role.projectParticipants, { onDelete: 'CASCADE' })
  role: Role;
}
