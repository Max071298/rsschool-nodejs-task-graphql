import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../uuid.js';
import { Profile, profileType } from '../profile/profile.js';
import { Post, postType } from '../post/post.js';
import { GraphQlContext } from '../../schema/context.js';

export type User = {
  id: string;
  name: String;
  balance: number;
  profile: Profile;
  posts: Post[];
  userSubscribedTo: User[];
  subscribedToUser: User[];
};

export const userType = new GraphQLObjectType<User, GraphQlContext>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType,
      resolve: async (userType, _args, context) => {
        return context.loaders.profileLoader.load(userType.id);
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (userType, _args, context) => {
        return await context.loaders.postsLoader.load(userType.id);
      },
    },

    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (userType, _args, context) => {
        return await context.loaders.userSubscribedToLoader.load(userType.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (userType, _args, context) => {
        return await context.loaders.subscribedToUserLoader.load(userType.id);
      },
    },
  }),
});
