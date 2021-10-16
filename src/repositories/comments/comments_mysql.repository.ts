import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCommentDto } from 'src/dto/create-comments.dto';
import { getAllCommentsDto } from 'src/dto/get-all-comments.dto';
import { CommentsEntity } from 'src/entities/comments.entity';
import {
  CommentsInterface,
  createCommentsInterface,
} from 'src/interface/comments.interface';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsMysqlService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly CommentRepository: Repository<CommentsEntity>,
  ) {}

  async createComment(data: createCommentDto): Promise<CommentsInterface> {
    const newComment = new CommentsEntity();
    newComment.comment = data.comments;
    newComment.order = data.orderId;
    newComment.user = data.userId;
    const comment = await this.CommentRepository.save(newComment);
    if (!comment) {
      return null;
    }
    return createCommentsInterface(comment);
  }

  async getUsersComments(userId: number) {
    const findComment = await this.CommentRepository.createQueryBuilder()
      .where('isDeleted=false')
      .andWhere('userId=:userId', { userId })
      .getMany();

    if (!findComment) {
      return false;
    }

    return createCommentsInterface(findComment);
  }

  async commentsBelongsToUser(
    commentId: number,
    userId: number,
  ): Promise<boolean> {
    const belongs = await this.CommentRepository.createQueryBuilder()
      .where('isDeleted = false')
      .andWhere('id IN (:...ids)', { ids: commentId })
      .andWhere('userId=:userId', { userId })
      .getMany();
    if (belongs.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getOneComment(id: number): Promise<CommentsInterface> {
    const getComment = await this.CommentRepository.findOne(id);
    if (!getComment) {
      return null;
    }

    return createCommentsInterface(getComment);
  }

  async getAllComments(data: getAllCommentsDto) {}

  async deleteComments(id: number): Promise<CommentsInterface> {
    const deletedComment = await this.CommentRepository.save({
      id,
      isDeleted: true,
    });
    if (!deletedComment) {
      return null;
    }
    return createCommentsInterface(deletedComment);
  }
  async updateComments(
    id: number,
    comment: string,
  ): Promise<CommentsInterface> {
    const updateComment = await this.CommentRepository.save({ id, comment });
    if (updateComment) {
      return null;
    }

    return createCommentsInterface(updateComment);
  }
}
