import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import { GraphQlContext } from './context.js';
import { memberType, memberTypeIdEnum } from '../types/member-type/memberType.js';
import { userType } from '../types/user/user.js';
import { UUIDType } from '../types/uuid.js';
import { postType } from '../types/post/post.js';
import { profileType } from '../types/profile/profile.js';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const rootQueryType = new GraphQLObjectType<unknown, GraphQlContext>({
  name: 'Query',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(memberType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.memberType.findMany();
      },
    },

    memberType: {
      type: memberType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeIdEnum) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        return context.prisma.memberType.findUnique({ where: { id: args.id } });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(userType))),
      resolve: async (_src, _args, context, info: GraphQLResolveInfo) => {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo,
          userType,
        );

        const incRel = {
          subscribedToUser: !!fields['subscribedToUser'],
          userSubscribedTo: !!fields['userSubscribedTo'],
        };

        const users = await context.prisma.user.findMany({
          include: {
            subscribedToUser: incRel.subscribedToUser,
            userSubscribedTo: incRel.userSubscribedTo,
          },
        });

        users.forEach((user) => {
          if (incRel.subscribedToUser) {
            context.prisma.subscribersOnAuthors.findMany({
              where: { subscriberId: user.id },
              include: { author: true },
            });
          }

          if (incRel.userSubscribedTo) {
            context.prisma.subscribersOnAuthors.findMany({
              where: { authorId: user.id },
              include: { subscriber: true },
            });
          }
        });

        return users;
      },
    },

    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        return await context.prisma.user.findUnique({ where: { id: args.id } });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(postType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.post.findMany();
      },
    },

    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        return context.prisma.post.findUnique({ where: { id: args.id } });
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(profileType))),
      resolve: async (_src, _args, context) => {
        return context.prisma.profile.findMany();
      },
    },

    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_src, args: { id: string }, context) => {
        return context.prisma.profile.findUnique({ where: { id: args.id } });
      },
    },
  }),
});
