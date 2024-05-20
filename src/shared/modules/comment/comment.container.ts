import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentService, DefaultCommentService, CommentEntity, CommentModel } from './index.js';
import { Component } from '../../types/index.js';

export function createCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<CommentService>(Component.UserService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.UserModel).toConstantValue(CommentModel);

  return commentContainer;
}
