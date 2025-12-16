import gql from 'graphql-tag';

/**
 * GraphQL query to retrieve agenda category by id.
 *
 * @param agendaCategoryId - The ID of the category which is being retrieved.
 * @returns Agenda category associated with the id.
 */

export const AGENDA_ITEM_CATEGORY_LIST = gql`
  query AgendaFolderByOrganization(
    $input: QueryAgendaFolderByOrganizationInput!
  ) {
    agendaFolderByOrganization(input: $input) {
      id
      name
      creator {
        id
        name
      }
    }
  }
`;
