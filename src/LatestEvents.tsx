import React from "react";
import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";

interface Event {
  id: string;
  name: string;
}

interface News {
  subscribeToEvents: Event;
}

const LATEST_EVENTS = gql`
  subscription getNewEvents {
    subscribeToEvents {
      id
      name
    }
  }
`;

export default () => {
  const { loading, data } = useSubscription<News>(LATEST_EVENTS);
  return (
    <div>
      <h5>Latest News</h5>
      <p>{loading ? "Loading..." : data!.subscribeToEvents.name}</p>
    </div>
  );
};
