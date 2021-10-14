import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/entities/review.entity';
import { ReviewMysqlRepo } from './review-mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity])],

  providers: [ReviewMysqlRepo],
  exports: [ReviewMysqlRepo, ReviewMysqlModule],
})
export class ReviewMysqlModule {}
