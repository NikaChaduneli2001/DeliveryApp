import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCommentDto } from 'src/dto/create-comments.dto';
import { CommentsEntity } from 'src/entities/comments.entity';
import { createCommentsInterface } from 'src/interface/comments.interface';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsMysqlService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly AddressRepository: Repository<CommentsEntity>,
  ) {}

  async createComment(data: createCommentDto) {
    const newComment = new CommentsEntity();
    newComment.comment = data.comments;
    newComment.order = data.orderId;
    newComment.user = data.userId;
    const comment = await this.AddressRepository.save(newComment);
    if (!comment) {
      return false;
    }
    return createCommentsInterface(comment);
  }
}
