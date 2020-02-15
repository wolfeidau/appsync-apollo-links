import React from "react";
import "./App.css";
import awsconfig from "./aws-exports";
import { ApolloLink } from "apollo-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { createAuthLink } from "aws-appsync-auth-link";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import EventList from "./EventList";
import LatestEvents from "./LatestEvents";

const config = {
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey
  },
  disableOffline: true
};

const link = ApolloLink.from([
  // @ts-ignore
  createAuthLink(config),
  // @ts-ignore
  createSubscriptionHandshakeLink(config)
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({ addTypename: false })
});

const App = () => (
  <div className="App">
    <EventList />
    <LatestEvents />
  </div>
);

const WithProvider = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default WithProvider;
