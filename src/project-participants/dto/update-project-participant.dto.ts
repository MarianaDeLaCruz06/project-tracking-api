import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectParticipantDto } from './create-project-participant.dto';

export class UpdateProjectParticipantDto extends PartialType(CreateProjectParticipantDto) {}
