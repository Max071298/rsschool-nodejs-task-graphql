import { PrismaClient, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { GraphQlContext, prisma } from '../schema/context.js';
import { memberType, MemberType } from '../types/member-type/memberType.js';
import { Profile } from '../types/profile/profile.js';
import { Post } from '../types/post/post.js';

export interface Loaders {
  memberTypeLoader: DataLoader<string, MemberType | null>;
  profileLoader: DataLoader<string, Profile | null>;
  postsLoader: DataLoader<string, Post[]>;
  userSubscribedToLoader: DataLoader<string, User[]>;
  subscribedToUserLoader: DataLoader<string, User[]>;
}

export function createLoaders(prisma: PrismaClient): Loaders {
  return {
    memberTypeLoader: new DataLoader(async (ids) => {
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      });

      const byId = new Map(memberTypes.map((member) => [member.id, member]));

      return ids.map((id) => byId.get(id) ?? null);
    }),

    profileLoader: new DataLoader(async (ids) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: ids as string[] } },
      });

      const byId = new Map(profiles.map((profile) => [profile.userId, profile]));

      return ids.map((id) => byId.get(id) ?? null);
    }),

    postsLoader: new DataLoader(async (ids) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: ids as string[] } },
      });

      return ids.map((id) => {
        const userPosts = posts.filter((post) => post.authorId === id);
        return userPosts;
      });
    }),

    userSubscribedToLoader: new DataLoader(async (ids) => {
      const authors = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: ids as string[] } },
        include: { author: true },
      });

      return ids.map((id) => {
        const userAuthors = authors.filter((author) => author.subscriberId === id);
        return userAuthors.map((userAuthor) => userAuthor.author);
      });
    }),

    subscribedToUserLoader: new DataLoader(async (ids) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: ids as string[] } },
        include: { subscriber: true },
      });

      return ids.map((id) => {
        const userSubscribers = subscribers.filter(
          (subscriber) => subscriber.authorId === id,
        );

        return userSubscribers.map((userSubscribers) => userSubscribers.subscriber);
      });
    }),
  };
}
