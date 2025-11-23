import { GraphQLSchema } from 'graphql';
import { rootQueryType } from './schema/query.js';
import { mutationType } from './schema/mutation.js';

export const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: mutationType,
});
