import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentService, DefaultCommentService, CommentEntity, CommentModel, CommentController } from './index.js';
import { Component } from '../../types/index.js';
import { Controller } from '../../libs/rest/controller/index.js';

export function createCommentContainer() {
  const commentContainer = new Container();
  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}
