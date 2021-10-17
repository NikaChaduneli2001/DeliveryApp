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
    newComment.comment = data.comment;
    newComment.order = data.orderId;
    newComment.user = data.userId;
    newComment.date = new Date();
    newComment.isDeleted = false;
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

  async getAllComments(data: getAllCommentsDto): Promise<any> {
    const query = await this.CommentRepository.createQueryBuilder('comment');
    query.innerJoinAndSelect('comment.order', 'order');
    query.innerJoinAndSelect('order.user', 'user');
    query.where('comment.isDeleted=false');
    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 0;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(data.limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getRawMany();
    if (result) {
      return result.map((comm) => ({
        id: comm.comment_id,
        comment: comm.comment_comment,
        order: {
          id: comm.comment_id,
          user: {
            id: comm.user_id,
            fullName: comm.user_fullName,
            role: comm.user_role,
            phone: comm.user_phone,
            address: comm.user_address,
          },
          orderList: JSON.parse(comm.order_orderList),
          status: comm.order_status,
          date: comm.order_data,
          deliveryAddress: comm.order_deliveryAddress,
          totalPrice: comm.order_totalPrice,
          rateStatus: comm.ordr_rateStatus,
        },
      }));
    } else {
      return null;
    }
  }

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
