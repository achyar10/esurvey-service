import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { EducationModule } from './app/education/education.module';
import { JobStatusModule } from './app/job-status/job-status.module';
import { JobTitleModule } from './app/job-title/job-title.module';
import { QuestionCategoryModule } from './app/question-category/question-category.module';
import { QuestionModule } from './app/question/question.module';
import { QuestionnaireRespondentModule } from './app/questionnaire-respondent/questionnaire-respondent.module';
import { QuestionnaireModule } from './app/questionnaire/questionnaire.module';
import { RespondentModule } from './app/respondent/respondent.module';
import { ResultModule } from './app/result/result.module';
import { UserModule } from './app/user/user.module';
import { JwtStrategy } from './utilities/strategy/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EducationModule,
    JobStatusModule,
    JobTitleModule,
    RespondentModule,
    QuestionCategoryModule,
    QuestionModule,
    QuestionnaireModule,
    QuestionnaireRespondentModule,
    ResultModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { config } = await import('./config/orm.config');
        return config;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
