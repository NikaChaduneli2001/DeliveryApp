import { OrdersEntity } from 'src/entities/orders.entity';
import { UsersEntity } from 'src/entities/users.entity';

export interface CommentsInterface {
  id: number;
  user: number | UsersEntity;
  order: number | OrdersEntity;
  comments: string;
  date: Date;
  isDeleted?: boolean;
}

export function createCommentsInterface(comment) {
  return {
    id: comment.id,
    user: comment.user,
    date: comment.date,
    order: comment.order,
    comments: comment.comments,
  };
}
