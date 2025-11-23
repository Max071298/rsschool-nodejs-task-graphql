import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../uuid.js';
import { MemberType, memberType } from '../member-type/memberType.js';
import { GraphQlContext } from '../../schema/context.js';

export type Profile = {
  id: string;
  isMale: Boolean;
  yearOfBirth: number;
  memberTypeId: string;
};

export const profileType = new GraphQLObjectType<Profile, GraphQlContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (src, _args, context) => {
        return context.prisma.memberType.findUnique({ where: { id: src.memberTypeId } });
      },
    },
  }),
});
