import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCommentDto } from 'src/dto/create-comments.dto';
import { getAllCommentsDto } from 'src/dto/get-all-comments.dto';
import { CommentsEntity } from 'src/entities/comments.entity';
import { createCommentsInterface } from 'src/interface/comments.interface';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsMysqlService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly CommentRepository: Repository<CommentsEntity>,
  ) {}

  async createComment(data: createCommentDto) {
    const newComment = new CommentsEntity();
    newComment.comment = data.comments;
    newComment.order = data.orderId;
    newComment.user = data.userId;
    const comment = await this.CommentRepository.save(newComment);
    if (!comment) {
      return false;
    }
    return createCommentsInterface(comment);
  }

  async getUsersComments(userId: number) {
    const findComment = await this.CommentRepository.createQueryBuilder()
      .where('isDeleted=false')
      .andWhere('restaurantId=:restaurantId', { userId })
      .getMany();

    if (!findComment) {
      return false;
    }

    return createCommentsInterface(findComment);
  }

  async getOneComment(id: number) {
    const getComment = await this.CommentRepository.findOne(id);
    if (!getComment) {
      return false;
    }

    return createCommentsInterface(getComment);
  }

  async getAllComments(data: getAllCommentsDto) {}

  async deleteComments(id: number, data) {}
}
