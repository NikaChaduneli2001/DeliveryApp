import { Injectable } from '@nestjs/common';
import { create } from 'domain';
import { createCommentDto } from 'src/dto/create-comments.dto';
import { getAllCommentsDto } from 'src/dto/get-all-comments.dto';
import { CommentsMysqlService } from 'src/repositories/comments/comments_mysql.repository';
import { OrdersRepository } from 'src/repositories/orders/orders_mysql.repository';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsMysqlService,
    private readonly OrdersRepo: OrdersRepository,
  ) {}

  async createComment(data: createCommentDto) {
    try {
      const getOneOrder = await this.OrdersRepo.getOneOrder(data.orderId);
      if (getOneOrder.status != 'Delivered') {
        return 'you can not create comment it is not delivered';
      }
      const created = await this.commentRepo.createComment(data);
      if (!created) {
        return false;
      }
      return created;
    } catch {
      return undefined;
    }
  }

  async getUsersComments(userId: number) {
    try {
      const foundComment = await this.commentRepo.getUsersComments(userId);
      if (!foundComment) {
        return false;
      }
      return foundComment;
    } catch {
      return undefined;
    }
  }

  async getAllComments(data: getAllCommentsDto) {
    try {
      const allComments = await this.commentRepo.getAllComments(data);
      if (!allComments) {
        return false;
      }
      return allComments;
    } catch {
      return undefined;
    }
  }

  async getOneComment(id: number) {
    try {
      const comment = await this.commentRepo.getOneComment(id);
      if (!comment) {
        return false;
      }
      return comment;
    } catch {
      return undefined;
    }
  }

  async deleteComments(id: number) {
    try {
      const deleted = await this.commentRepo.deleteComments(id);
      if (!deleted) {
        return false;
      }

      return deleted;
    } catch {
      return undefined;
    }
  }

  async updateComment(id: number, comment: string) {
    try {
      const updated = await this.commentRepo.updateComments(id, comment);
      if (!updated) {
        return false;
      }
      return updated;
    } catch {
      return undefined;
    }
  }

  async belongsToUser(commentId: number, userId: number) {
    try {
      const belongs = await this.commentRepo.commentsBelongsToUser(
        commentId,
        userId,
      );
      if (!belongs) {
        return false;
      }
      return true;
    } catch {
      return undefined;
    }
  }
}
