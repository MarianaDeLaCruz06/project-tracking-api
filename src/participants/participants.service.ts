import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
  ) {}

  create(createDto: CreateParticipantDto) {
    const participant = this.participantRepo.create(createDto);
    return this.participantRepo.save(participant);
  }

  findAll() {
    return this.participantRepo.find();
  }

  async findOne(id: number) {
    const participant = await this.participantRepo.findOne({ where: { id } });
    if (!participant) throw new NotFoundException('Participant not found');
    return participant;
  }

  async update(id: number, updateDto: UpdateParticipantDto) {
    const participant = await this.findOne(id);
    Object.assign(participant, updateDto);
    return this.participantRepo.save(participant);
  }

  async remove(id: number) {
    const participant = await this.findOne(id);
    return this.participantRepo.remove(participant);
  }
}
