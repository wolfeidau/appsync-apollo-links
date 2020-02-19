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

import Auth from "@aws-amplify/auth";
import useAmplifyAuth from "./useAmplifyAuth";

Auth.configure(awsconfig);

const getAccessToken = (): Promise<string> => {
  return Auth.currentSession().then(session => {
    return session.getAccessToken().getJwtToken();
  });
};

const config = {
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: awsconfig.aws_appsync_authenticationType,
    jwtToken: getAccessToken
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

const App = () => {
  const {
    state: { user },
    handleSignout
  } = useAmplifyAuth();

  return !user ? (
    <div>
      <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
    </div>
  ) : (
    <div className="App">
      <button onClick={handleSignout}>Sign Out</button>
      <EventList />
      <LatestEvents />
    </div>
  );
};

const WithProvider = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default WithProvider;
