import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionCategoryController } from './question-category.controller';
import { QuestionCategory } from './question-category.entity';
import { QuestionCategoryService } from './question-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionCategory])],
  exports: [TypeOrmModule],
  controllers: [QuestionCategoryController],
  providers: [QuestionCategoryService]
})
export class QuestionCategoryModule {}
