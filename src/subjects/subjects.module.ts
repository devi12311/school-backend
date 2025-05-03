import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { Subject } from '../entities/subject.entity';
import { GorseModule } from '../gorse/gorse.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), forwardRef(() => GorseModule)],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
