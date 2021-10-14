import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from 'src/entities/comments.entity';
import { CommentsMysqlService } from './comments_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsEntity])],
  providers: [CommentsMysqlService],
  exports: [CommentMysqlModule, CommentsMysqlService],
})
export class CommentMysqlModule {}
