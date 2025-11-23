import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../uuid.js';
import { GraphQlContext } from '../../schema/context.js';

export type Post = {
  id: string;
  title: string;
  content: string;
};

export const postType = new GraphQLObjectType<Post, GraphQlContext>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
