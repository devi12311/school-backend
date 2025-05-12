import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Job } from '../entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { BulkCreateJobDto } from './dto/bulk-create-job.dto';
import { GorseService } from '../gorse/gorse.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @Inject(forwardRef(() => GorseService))
    private gorseService: GorseService,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create(createJobDto);
    const savedJob = await this.jobsRepository.save(job);

    // Insert into Gorse
    await this.gorseService.insertItem({
      ItemId: `job:${savedJob.id}`,
      IsHidden: false,
      Categories: ['3'], // Using category 3 for jobs
      Timestamp: new Date().toISOString(),
      Labels: [...savedJob.categories, ...savedJob.parentCategories],
      Comment: savedJob.title,
    });

    return savedJob;
  }

  async bulkCreate(bulkCreateJobDto: BulkCreateJobDto): Promise<Job[]> {
    const jobs = this.jobsRepository.create(bulkCreateJobDto.jobs);
    const savedJobs = await this.jobsRepository.save(jobs);

    // Insert into Gorse
    const gorseItems = savedJobs.map((job) => ({
      ItemId: `job:${job.id}`,
      IsHidden: false,
      Categories: ['3'], // Using category 3 for jobs
      Timestamp: new Date().toISOString(),
      Labels: [...job.tags],
      Comment: job.title,
    }));

    await this.gorseService.insertItems(gorseItems);

    return savedJobs;
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, updateJobDto);
    return this.jobsRepository.save(job);
  }

  async remove(id: number): Promise<void> {
    const job = await this.findOne(id);
    await this.jobsRepository.remove(job);
  }

  async findMany(ids: number[]): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { id: In(ids) },
    });
  }
}
