import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  constructor(@InjectRepository(Status) private readonly statusRepo: Repository<Status>) {}

  create(dto: CreateStatusDto) {
    const status = this.statusRepo.create(dto);
    return this.statusRepo.save(status);
  }

  findAll() {
    return this.statusRepo.find();
  }

  async findOne(id: number) {
    const status = await this.statusRepo.findOne({ where: { id } });
    if (!status) throw new NotFoundException('Status not found');
    return status;
  }

  async update(id: number, dto: UpdateStatusDto) {
    const status = await this.findOne(id);
    Object.assign(status, dto);
    return this.statusRepo.save(status);
  }

  async remove(id: number) {
    const status = await this.findOne(id);
    return this.statusRepo.remove(status);
  }
}
