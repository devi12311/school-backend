import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { BulkCreateSubjectDto } from './dto/bulk-create-subject.dto';
import { GorseService } from '../gorse/gorse.service';
import { SubjectResponseDto } from './dto/subject-response.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
    @Inject(forwardRef(() => GorseService))
    private gorseService: GorseService,
  ) {}

  private mapToResponseDto(subject: Subject): SubjectResponseDto {
    if (!subject.major) {
      throw new Error('Subject must have a major');
    }
    if (!subject.major.university) {
      throw new Error('Subject\'s major must have a university');
    }

    return {
      id: subject.id,
      name: subject.name,
      tags: subject.tags,
      major: {
        id: subject.major.id,
        name: subject.major.name,
      },
      university: {
        id: subject.major.university.id,
        name: subject.major.university.name,
        logo: subject.major.university.logo,
      },
      created_at: subject.created_at,
      updated_at: subject.updated_at,
    };
  }

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectResponseDto> {
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

    const fullSubject = await this.subjectsRepository.findOne({
      where: { id: savedSubject.id },
      relations: ['major', 'major.university'],
    });
    if (!fullSubject) {
      throw new NotFoundException(`Subject with ID ${savedSubject.id} not found`);
    }
    return this.mapToResponseDto(fullSubject);
  }

  async bulkCreate(
    bulkCreateSubjectDto: BulkCreateSubjectDto,
  ): Promise<SubjectResponseDto[]> {
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

    const fullSubjects = await this.subjectsRepository.find({
      where: { id: In(savedSubjects.map(s => s.id)) },
      relations: ['major', 'major.university'],
    });
    return fullSubjects.map(subject => this.mapToResponseDto(subject));
  }

  async findAll(): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectsRepository.find({
      relations: ['major', 'major.university'],
    });
    return subjects.map(subject => this.mapToResponseDto(subject));
  }

  async findOne(id: number): Promise<SubjectResponseDto> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: ['major', 'major.university'],
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return this.mapToResponseDto(subject);
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: ['major', 'major.university'],
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    Object.assign(subject, updateSubjectDto);
    await this.subjectsRepository.save(subject);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const subject = await this.subjectsRepository.findOne({
      where: { id },
      relations: ['major', 'major.university'],
    });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    await this.subjectsRepository.remove(subject);
  }

  async findMany(ids: number[]): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectsRepository.find({
      where: { id: In(ids) },
      relations: ['major', 'major.university'],
    });
    return subjects.map(subject => this.mapToResponseDto(subject));
  }
}
