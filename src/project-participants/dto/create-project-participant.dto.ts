import { IsInt } from 'class-validator';

export class CreateProjectParticipantDto {
  @IsInt()
  projectId: number;

  @IsInt()
  participantId: number;

  @IsInt()
  roleId: number;
}
