import { IsString, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  statusId: number; // <--- en vez de string

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsInt()
  projectId: number;
}
