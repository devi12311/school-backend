import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Major } from '../entities/major.entity';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { BulkCreateMajorDto } from './dto/bulk-create-major.dto';
import { GorseService } from '../gorse/gorse.service';

interface GorseRecommendation {
  ItemId: string;
  Score: number;
}

@Injectable()
export class MajorsService {
  constructor(
    @InjectRepository(Major)
    private majorsRepository: Repository<Major>,
    @Inject(forwardRef(() => GorseService))
    private gorseService: GorseService,
  ) {}

  async create(createMajorDto: CreateMajorDto): Promise<Major> {
    const major = this.majorsRepository.create(createMajorDto);
    const savedMajor = await this.majorsRepository.save(major);

    // Insert into Gorse
    await this.gorseService.insertItem({
      ItemId: `major:${savedMajor.id}`,
      IsHidden: false,
      Categories: ['1'],
      Timestamp: new Date().toISOString(),
      Labels: savedMajor.tags,
      Comment: savedMajor.name,
    });

    return savedMajor;
  }

  async bulkCreate(bulkCreateMajorDto: BulkCreateMajorDto): Promise<Major[]> {
    const majors = this.majorsRepository.create(bulkCreateMajorDto.majors);
    const savedMajors = await this.majorsRepository.save(majors);

    // Insert into Gorse
    const gorseItems = savedMajors.map((major) => ({
      ItemId: `major:${major.id}`,
      IsHidden: false,
      Categories: ['1'],
      Timestamp: new Date().toISOString(),
      Labels: major.tags,
      Comment: major.name,
    }));

    await this.gorseService.insertItems(gorseItems);

    return savedMajors;
  }

  async findAll(): Promise<Major[]> {
    return this.majorsRepository.find({
      relations: ['category', 'subjects'],
    });
  }

  async findOne(id: number): Promise<Major> {
    const major = await this.majorsRepository.findOne({
      where: { id },
      relations: ['category', 'subjects'],
    });
    if (!major) {
      throw new NotFoundException(`Major with ID ${id} not found`);
    }
    return major;
  }

  async update(id: number, updateMajorDto: UpdateMajorDto): Promise<Major> {
    const major = await this.findOne(id);
    Object.assign(major, updateMajorDto);
    const updatedMajor = await this.majorsRepository.save(major);

    // Update in Gorse
    await this.gorseService.insertItem({
      ItemId: `major:${updatedMajor.id}`,
      IsHidden: false,
      Categories: ['1'],
      Timestamp: new Date().toISOString(),
      Labels: updatedMajor.tags,
      Comment: updatedMajor.name,
    });

    return updatedMajor;
  }

  async remove(id: number): Promise<void> {
    const major = await this.findOne(id);
    await this.majorsRepository.remove(major);
  }

  async getRecommendedMajors(userId: string, n: number = 10): Promise<Major[]> {
    const recommendations = (await this.gorseService.getRecommendations(
      userId,
      n,
    )) as unknown as GorseRecommendation[];

    // Extract major IDs from recommendations
    const majorIds = recommendations.map((rec) =>
      parseInt(rec.ItemId.replace('major:', '')),
    );

    // Fetch the actual majors
    const majors = await this.majorsRepository.find({
      where: { id: In(majorIds) },
      relations: ['category', 'subjects'],
    });

    // Sort majors to match recommendation order
    return majorIds
      .map((id) => majors.find((major) => major.id === id))
      .filter((major): major is Major => major !== undefined);
  }

  async addMajorFeedback(
    userId: string,
    majorId: number,
    feedbackType: string = 'star',
  ): Promise<void> {
    await this.gorseService.insertFeedback({
      FeedbackType: feedbackType,
      UserId: userId,
      ItemId: `major:${majorId}`,
      Timestamp: new Date().toISOString(),
    });
  }

  async findMany(ids: number[]): Promise<Major[]> {
    return this.majorsRepository.find({
      where: { id: In(ids) },
      relations: ['category', 'subjects'],
    });
  }
}
