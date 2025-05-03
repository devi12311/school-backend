import { Global, Module, forwardRef } from '@nestjs/common';
import { GorseService } from './gorse.service';
import { RecommendationsController } from './recommendations.controller';
import { MajorsModule } from '../majors/majors.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { ArticlesModule } from '../articles/articles.module';
import { JobsModule } from '../jobs/jobs.module';

@Global()
@Module({
  imports: [
    forwardRef(() => MajorsModule),
    forwardRef(() => SubjectsModule),
    forwardRef(() => ArticlesModule),
    forwardRef(() => JobsModule),
  ],
  providers: [GorseService],
  controllers: [RecommendationsController],
  exports: [GorseService],
})
export class GorseModule {}
