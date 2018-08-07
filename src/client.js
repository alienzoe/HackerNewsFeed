import React from "react";
// import ApolloClient from "apollo-boost";
import { Query } from "react-apollo";
import { AUTH_TOKEN } from "./constants";

import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { ApolloLink, concat, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

// export const client = new ApolloClient({
//   uri: "http://localhost:8080",
//   request: async operation => {
//     const token = localStorage.getItem(AUTH_TOKEN);

//     operation.setContext({
//       headers: {
//         authorization: token ? `Bearer ${token}` : ""
//       }
//     });
//   }
// });

const httpLink = createHttpLink({
  uri: "http://localhost:8080"
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:8080",
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(AUTH_TOKEN);

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ""
    }
  });

  return forward(operation);
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subsciption";
  },
  wsLink,
  concat(authMiddleware, httpLink)
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export { ApolloProvider as ClientProvider, Mutation } from "react-apollo";
export { gql as ql } from "apollo-boost";

export const QUERY = ({ children, ...rest }) => (
  <Query {...rest}>
    {({ err, loading, data, subscribeToMore }) => {
      if (err) {
        return "Sorry, Somethings wrong!";
      }
      if (loading) {
        return "Loading....";
      }

      return children(data, subscribeToMore);
    }}
  </Query>
);

// export const MUTATION = ({ hasLoading, children, ...rest }) => (
//   <Mutation {...rest}>{(mutates, { loading }) => children(mutates)}</Mutation>
// );
