import gql from 'graphql-tag';

export const AgendaItemByEvent = gql`
  query AgendaItemsByEvent($eventId: ID!) {
    agendaItemByEventId(eventId: $eventId) {
      id
      name
      description
      type
      duration
      key
      sequence
      createdAt
      updatedAt

      url {
        id
        url
      }

      creator {
        id
        name
      }

      updater {
        id
        name
      }

      event {
        id
        name
      }

      folder {
        id
        name
      }
    }
  }
`;
