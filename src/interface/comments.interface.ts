import { OrdersEntity } from 'src/entities/orders.entity';
import { UsersEntity } from 'src/entities/users.entity';

export interface CommentsInterface {
  id: number;
  user: number | UsersEntity;
  order: number | OrdersEntity;
  comments: string;
}

export function createCommentsInterface(comment) {
  return {
    id: comment.id,
    user: comment.user,
    order: comment.order,
    comments: comment.comments,
  };
}
