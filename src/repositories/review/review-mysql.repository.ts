import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MakeReviewDTO } from 'src/dto/make-review.dto';
import { ReviewEntity } from 'src/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewMysqlRepo {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly ReviewRepository: Repository<ReviewEntity>,
  ) {}

  async makeReview(data: MakeReviewDTO, userId: number) {
    try {
      const newReview = new ReviewEntity();
      newReview.order = data.orderId;
      newReview.comment = data.comment;
      newReview.stars = data.stars;
      newReview.user = userId;

      await this.ReviewRepository.save(newReview);
      this.logger.log(`Create Restaurant ${newReview}`);

      return newReview;
    } catch (error) {
      this.logger.log(`Could Not Create Review`);
      return null;
    }
  }
}
