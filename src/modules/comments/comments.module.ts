import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentMysqlModule } from 'src/repositories/comments/comments_mysql.module';

@Module({
  imports: [CommentMysqlModule],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService, CommentsModule],
})
export class CommentsModule {}
