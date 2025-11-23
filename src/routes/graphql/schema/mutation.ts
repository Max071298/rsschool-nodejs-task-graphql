import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQlContext } from './context.js';
import { userType } from '../types/user/user.js';
import { changeUserInput, createUserInput } from '../types/user/userInputs.js';
import { profileType } from '../types/profile/profile.js';
import {
  changeProfileInput,
  createProfileInput,
} from '../types/profile/profileInputs.js';
import { postType } from '../types/post/post.js';
import { changePostInput, createPostInput } from '../types/post/postInputs.js';
import { UUIDType } from '../types/uuid.js';

export const mutationType = new GraphQLObjectType<unknown, GraphQlContext>({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(userType),
      args: {
        dto: { type: new GraphQLNonNull(createUserInput) },
      },
      resolve: async (
        _src,
        { dto }: { dto: { name: string; balance: number } },
        context,
      ) => {
        const user = context.prisma.user.create({
          data: { name: dto.name, balance: dto.balance },
        });

        return user;
      },
    },

    createProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        dto: { type: new GraphQLNonNull(createProfileInput) },
      },
      resolve: async (
        _src,
        {
          dto,
        }: {
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        context,
      ) => {
        const profile = context.prisma.profile.create({
          data: {
            isMale: dto.isMale,
            yearOfBirth: dto.yearOfBirth,
            userId: dto.userId,
            memberTypeId: dto.memberTypeId,
          },
        });

        return profile;
      },
    },

    createPost: {
      type: new GraphQLNonNull(postType),
      args: {
        dto: { type: new GraphQLNonNull(createPostInput) },
      },
      resolve: async (
        _src,
        { dto }: { dto: { title: string; content: string; authorId: string } },
        context,
      ) => {
        const post = context.prisma.post.create({
          data: { title: dto.title, content: dto.content, authorId: dto.authorId },
        });

        return post;
      },
    },

    changePost: {
      type: new GraphQLNonNull(postType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changePostInput) },
      },
      resolve: async (
        _src,
        args: { id: string; dto: { title: string; content: string } },
        context,
      ) => {
        const post = context.prisma.post.update({
          where: { id: args.id },
          data: { title: args.dto.title, content: args.dto.content },
        });

        return post;
      },
    },

    changeProfile: {
      type: new GraphQLNonNull(profileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeProfileInput) },
      },
      resolve: async (
        _src,
        args: {
          id: string;
          dto: { isMale: boolean; yearOfBirth: number; memberTypeId: string };
        },
        context,
      ) => {
        const profile = context.prisma.profile.update({
          where: { id: args.id },
          data: {
            isMale: args.dto.isMale,
            yearOfBirth: args.dto.yearOfBirth,
            memberTypeId: args.dto.memberTypeId,
          },
        });

        return profile;
      },
    },

    changeUser: {
      type: new GraphQLNonNull(userType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(changeUserInput) },
      },
      resolve: async (
        _src,
        args: { id: string; dto: { name: string; balance: number } },
        context,
      ) => {
        const user = context.prisma.user.update({
          where: { id: args.id },
          data: {
            name: args.dto.name,
            balance: args.dto.balance,
          },
        });

        return user;
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        await context.prisma.user.delete({ where: { id: args.id } });
        return 'User deleted';
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        await context.prisma.post.delete({ where: { id: args.id } });
        return 'Post deleted';
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        await context.prisma.profile.delete({ where: { id: args.id } });
        return 'Profile deleted';
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { userId: string; authorId: string }, context) => {
        await context.prisma.user.update({
          where: { id: args.userId },
          data: {
            userSubscribedTo: { create: { authorId: args.authorId } },
          },
        });

        return 'Subscription made';
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { userId: string; authorId: string }, context) => {
        await context.prisma.user.update({
          where: { id: args.userId },
          data: {
            userSubscribedTo: {
              delete: {
                subscriberId_authorId: {
                  subscriberId: args.userId,
                  authorId: args.authorId,
                },
              },
            },
          },
        });

        return 'Unsubscription made';
      },
    },
  }),
});
