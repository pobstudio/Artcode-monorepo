import { ApolloClient, InMemoryCache } from '@apollo/client';
import { CHAIN_ID, SUBGRAPH_LINK, TEST_SUBGRAPH_LINK } from '../constants';

export const subgraphClient = new ApolloClient({
  uri: CHAIN_ID === 1 ? SUBGRAPH_LINK : TEST_SUBGRAPH_LINK,
  cache: new InMemoryCache(),
});
