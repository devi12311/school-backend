import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { Job } from '../entities/job.entity';
import { GorseModule } from '../gorse/gorse.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), forwardRef(() => GorseModule)],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
