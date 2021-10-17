import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { createCommentDto } from 'src/dto/create-comments.dto';
import { getAllCommentsDto } from 'src/dto/get-all-comments.dto';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(@Body() data: createCommentDto) {
    try {
      const created = await this.commentsService.createComment(data);
      if (!created) {
        return getErrorMessage('could not created comment');
      }
      return getSuccessMessage(created);
    } catch {
      return getErrorMessage('could not create comment with given params');
    }
  }

  @Get(':id')
  async getOneComment(@Param('id') id: number) {
    try {
      const foundComment = await this.commentsService.getOneComment(id);
      if (!foundComment) {
        return getErrorMessage('could not find comment');
      }
      return getSuccessMessage(foundComment);
    } catch {
      return getErrorMessage('could not find comment with given params');
    }
  }

  @Get(':commentId')
  async getUsersComments(@Param('commentId') commentId: number, @Req() req) {
    try {
      const { user } = req;
      const belongs = await this.commentsService.belongsToUser(
        commentId,
        user.userId,
      );
      if (!belongs) {
        return false;
      }
      const foundComment = await this.commentsService.getUsersComments(
        user.userId,
      );
      if (!foundComment) {
        return getErrorMessage('could not found users comments');
      }
      return getSuccessMessage(foundComment);
    } catch {
      return getErrorMessage(
        'could not foundComment comment with given params',
      );
    }
  }

  @Get()
  async getAllComments(@Query() data: getAllCommentsDto) {
    try {
      const comments = await this.commentsService.getAllComments(data);
      if (!comments) {
        return getErrorMessage('could not get all comments');
      }
      return getSuccessMessage(comments);
    } catch {
      return getErrorMessage('could not get all comments with given params');
    }
  }

  @Delete(':id')
  async deleteComments(@Param('id') id: number, @Req() req) {
    try {
      const { user } = req;
      const belongs = await this.commentsService.belongsToUser(id, user.userId);
      if (!belongs) {
        return getErrorMessage('not belongs to user');
      }
      const deleted = await this.commentsService.deleteComments(id);
      if (!deleted) {
        return getErrorMessage('could not deleted comments');
      }
      return getSuccessMessage(deleted);
    } catch {
      return getErrorMessage('could not deleted comments with given params');
    }
  }

  @Patch(':id')
  async updateComment(@Param('id') id: number, comment: string, @Req() req) {
    const { user } = req;
    const belongs = await this.commentsService.belongsToUser(id, user.userId);
    if (!belongs) {
      return getErrorMessage('not belongs comment to user');
    }
    const updated = await this.commentsService.updateComment(id, comment);
    if (!updated) {
      return getErrorMessage('Coul not updated comment');
    }

    return getSuccessMessage(updated);
  }
}
