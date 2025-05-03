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
    @InjectRepository(Major, 'gorse')
    private gorseMajorsRepository: Repository<any>,
  ) {}

  async create(createMajorDto: CreateMajorDto): Promise<Major> {
    const major = this.majorsRepository.create(createMajorDto);
    return this.majorsRepository.save(major);
  }

  async bulkCreate(bulkCreateMajorDto: BulkCreateMajorDto): Promise<Major[]> {
    // Create in the main database
    const majors = this.majorsRepository.create(bulkCreateMajorDto.majors);
    const savedMajors = await this.majorsRepository.save(majors);

    const mappedMajorsForGorse = bulkCreateMajorDto.majors.map((major) => {
      return {
        itemId: major.id,
        isHidden: false,
        categories: ['1'],
        labels: major.tags,
      };
    });
    // Create in the gorse database
    const gorseMajors = this.gorseMajorsRepository.create(mappedMajorsForGorse);
    await this.gorseMajorsRepository.save(gorseMajors);

    return savedMajors;
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
