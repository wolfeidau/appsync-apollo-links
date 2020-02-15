# appsync-apollo-links

This is an demonstrating the ability to pair back the libraries you use to the minimum supported without offline support. This example uses the [apollo client](https://www.apollographql.com/) with react hooks.

This example is built on [Create React App](https://create-react-app.dev).

# Configuration

You MUST create a new `src/aws-exports.ts` file containing the settings, in this example is the API_KEY setup.

```ts
export default {
    aws_appsync_graphqlEndpoint: "https://XXXX.appsync-api.ap-southeast-2.amazonaws.com/graphql",
    aws_appsync_region: "ap-southeast-2",
    aws_appsync_authenticationType: "API_KEY",
    aws_appsync_apiKey: "XXX-XXXXXXXXXXXXXXXXXXXXXXX"
}
```

# Development

```
npm start
```

# Subscriptions

I used the `Event App` example schema and added one extra subscription to the `Subscription` type.

```graphql
	subscribeToEvents: Event
		@aws_subscribe(mutations: ["createEvent"])
```

# Code

The core of this solution is in [App.tsx](src/App.tsx) file.

```ts
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
```

# Links 

* https://create-react-app.dev/docs/adding-typescript/
* https://www.apollographql.com/docs/react/development-testing/static-typing/
* https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/450
* https://github.com/awslabs/aws-mobile-appsync-sdk-js#using-authorization-and-subscription-links-with-apollo-client-no-offline-support

# License

This code was authored by [Mark Wolfe](https://github.com/wolfeidau) and licensed under the [Apache 2.0 license](http://www.apache.org/licenses/LICENSE-2.0).