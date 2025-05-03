import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { MajorsModule } from './majors/majors.module';
import { ArticlesModule } from './articles/articles.module';
import { UniversitiesModule } from './universities/universities.module';
import { SubjectsModule } from './subjects/subjects.module';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Major } from './entities/major.entity';
import { Subject } from './entities/subject.entity';
import { Article } from './entities/article.entity';
import { Question } from './entities/question.entity';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { Job } from './entities/job.entity';
import { University } from './entities/university.entity';
import { Progress } from './entities/progress.entity';
import { JobsModule } from './jobs/jobs.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'school_db'),
        entities: [
          User,
          Category,
          Major,
          Subject,
          Article,
          Question,
          Quiz,
          QuizQuestion,
          Job,
          University,
          Progress,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'gorse',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: 'gorse',
        entities: [],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    MajorsModule,
    ArticlesModule,
    UniversitiesModule,
    SubjectsModule,
    JobsModule,
    QuizzesModule,
    QuestionsModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
