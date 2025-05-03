import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { BulkCreateSubjectDto } from './dto/bulk-create-subject.dto';
import { GorseService } from '../gorse/gorse.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
    private gorseService: GorseService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const subject = this.subjectsRepository.create(createSubjectDto);
    const savedSubject = await this.subjectsRepository.save(subject);

    // Insert into Gorse
    await this.gorseService.insertItem({
      ItemId: `subject:${savedSubject.id}`,
      IsHidden: false,
      Categories: ['1'],
      Timestamp: new Date().toISOString(),
      Labels: savedSubject.tags,
      Comment: savedSubject.name,
    });

    return savedSubject;
  }

  async bulkCreate(
    bulkCreateSubjectDto: BulkCreateSubjectDto,
  ): Promise<Subject[]> {
    const subjects = this.subjectsRepository.create(
      bulkCreateSubjectDto.subjects,
    );
    const savedSubjects = await this.subjectsRepository.save(subjects);

    // Insert into Gorse
    const gorseItems = savedSubjects.map((subject) => ({
      ItemId: `subject:${subject.id}`,
      IsHidden: false,
      Categories: ['4'],
      Timestamp: new Date().toISOString(),
      Labels: subject.tags,
      Comment: subject.name,
    }));

    await this.gorseService.insertItems(gorseItems);

    return savedSubjects;
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectsRepository.find({
      relations: ['category', 'major'],
    });
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: ['category', 'major'],
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    return this.subjectsRepository.save(subject);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.findOne(id);
    await this.subjectsRepository.remove(subject);
  }
}
