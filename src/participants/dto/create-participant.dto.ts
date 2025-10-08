import { IsString, IsEmail } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
