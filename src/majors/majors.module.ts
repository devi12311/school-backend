import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorsService } from './majors.service';
import { MajorsController } from './majors.controller';
import { Major } from '../entities/major.entity';
import { GorseModule } from '../gorse/gorse.module';

@Module({
  imports: [TypeOrmModule.forFeature([Major]), forwardRef(() => GorseModule)],
  controllers: [MajorsController],
  providers: [MajorsService],
  exports: [MajorsService],
})
export class MajorsModule {}
