import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from '../entities/university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { BulkCreateUniversityDto } from './dto/bulk-create-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private universitiesRepository: Repository<University>,
  ) {}

  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    const university = this.universitiesRepository.create(createUniversityDto);
    return this.universitiesRepository.save(university);
  }

  async bulkCreate(
    bulkCreateUniversityDto: BulkCreateUniversityDto,
  ): Promise<University[]> {
    const universities = this.universitiesRepository.create(
      bulkCreateUniversityDto.universities,
    );
    return this.universitiesRepository.save(universities);
  }

  async findAll(): Promise<University[]> {
    return this.universitiesRepository.find({
      relations: ['majors', 'majors.subjects'],
    });
  }

  async findOne(id: number): Promise<University> {
    const university = await this.universitiesRepository.findOne({
      where: { id },
      relations: ['majors', 'majors.subjects'],
    });
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  async update(
    id: number,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University> {
    const university = await this.findOne(id);
    Object.assign(university, updateUniversityDto);
    return this.universitiesRepository.save(university);
  }

  async remove(id: number): Promise<void> {
    const university = await this.findOne(id);
    await this.universitiesRepository.remove(university);
  }
}
