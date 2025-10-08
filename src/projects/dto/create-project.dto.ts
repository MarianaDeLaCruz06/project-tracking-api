import { IsString, IsOptional, IsDateString, IsIn, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['macro', 'sub'])
  type: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  statusId: number; // <--- en vez de string

  @IsOptional()
  @IsInt()
  parentId?: number;
}
