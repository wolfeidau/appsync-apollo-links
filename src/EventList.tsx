import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

interface Event {
  id: string;
  name: string;
}

interface EventsData {
  listEvents: {
    items: Event[];
  };
}

const LIST_EVENTS = gql`
  query ListEvents {
    listEvents {
      items {
        id
        name
      }
    }
  }
`;

export default () => {
  const { loading, data } = useQuery<EventsData>(LIST_EVENTS);
  return (
    <div>
      <h3>Available Inventory</h3>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.listEvents.items.map(event => (
                <tr>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
