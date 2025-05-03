import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Major } from '../entities/major.entity';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { BulkCreateMajorDto } from './dto/bulk-create-major.dto';

@Injectable()
export class MajorsService {
  constructor(
    @InjectRepository(Major)
    private majorsRepository: Repository<Major>,
  ) {}

  async create(createMajorDto: CreateMajorDto): Promise<Major> {
    const major = this.majorsRepository.create(createMajorDto);
    return this.majorsRepository.save(major);
  }

  async bulkCreate(bulkCreateMajorDto: BulkCreateMajorDto): Promise<Major[]> {
    const majors = this.majorsRepository.create(bulkCreateMajorDto.majors);
    return this.majorsRepository.save(majors);
  }

  async findAll(): Promise<Major[]> {
    return this.majorsRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Major> {
    const major = await this.majorsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!major) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }
    return major;
  }

  async update(id: number, updateMajorDto: UpdateMajorDto): Promise<Major> {
    const major = await this.findOne(id);
    Object.assign(major, updateMajorDto);
    return this.majorsRepository.save(major);
  }

  async remove(id: number): Promise<void> {
    const major = await this.findOne(id);
    await this.majorsRepository.remove(major);
  }
}
