/**
 * AgendaCategoryCreateModal Component
 *
 * This component renders a modal for creating a new agenda category.
 * It includes a form with fields for the category name and description,
 * and handles form submission through a provided handler function.
 *
 * @component
 * @param {InterfaceAgendaCategoryCreateModalProps} props - The props for the component.
 * @param {boolean} props.agendaCategoryCreateModalIsOpen - Determines if the modal is visible.
 * @param {() => void} props.hideCreateModal - Function to close the modal.
 * @param {InterfaceFormStateType} props.formState - The current state of the form fields.
 * @param {(state: React.SetStateAction<InterfaceFormStateType>) => void} props.setFormState - Function to update the form state.
 * @param {(e: ChangeEvent<HTMLFormElement>) => Promise<void>} props.createAgendaCategoryHandler - Handler for form submission.
 * @param {(key: string) => string} props.t - Translation function for internationalization.
 *
 * @interface InterfaceFormStateType
 * @property {string} name - The name of the agenda category.
 * @property {string} description - The description of the agenda category.
 * @property {string} createdBy - The creator of the agenda category.
 *
 * @interface InterfaceAgendaCategoryCreateModalProps
 * @property {boolean} agendaCategoryCreateModalIsOpen - Modal visibility state.
 * @property {() => void} hideCreateModal - Function to hide the modal.
 * @property {InterfaceFormStateType} formState - Form state object.
 * @property {(state: React.SetStateAction<InterfaceFormStateType>) => void} setFormState - State updater for the form.
 * @property {(e: ChangeEvent<HTMLFormElement>) => Promise<void>} createAgendaCategoryHandler - Form submission handler.
 * @property {(key: string) => string} t - Translation function.
 *
 * @returns {JSX.Element} The rendered modal component.
 */
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type { ChangeEvent } from 'react';
import styles from 'style/app-fixed.module.css';

// interface InterfaceFormStateType {
//   name: string;
//   description: string;
//   creator: {
//     name: string;
//   };
// }
// interface InterfaceAgendaCategoryCreateModalProps {
//   agendaCategoryCreateModalIsOpen: boolean;
//   hideCreateModal: () => void;
//   formState: InterfaceFormStateType;
//   setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
//   createAgendaCategoryHandler: (
//     e: ChangeEvent<HTMLFormElement>,
//   ) => Promise<void>;
//   t: (key: string) => string;
// }

interface InterfaceFormStateType {
  id: string;
  name: string;
  description: string;
  creator: {
    name: string;
  };
}

interface InterfaceAgendaFolderCreateModalProps {
  agendaFolderCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  createAgendaFolderHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
}

const AgendaFolderCreateModal: React.FC<
  InterfaceAgendaFolderCreateModalProps
> = ({
  agendaFolderCreateModalIsOpen,
  hideCreateModal,
  formState,
  setFormState,
  createAgendaFolderHandler,
  t,
}) => {
  return (
    <Modal
      className={`mt-5 ${styles.campaignModal}`}
      show={agendaFolderCreateModalIsOpen}
      onHide={hideCreateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalOrganizationEvents}>
          {t('agendaFolderDetails')}
        </p>
        <Button
          variant="danger"
          onClick={hideCreateModal}
          data-testid="createAgendaFolderModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createAgendaFolderHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>{t('name')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('namePlaceholder')}
              value={formState.name}
              required
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('description')}
              required
              value={formState.description}
              onChange={(e) =>
                setFormState({ ...formState, description: e.target.value })
              }
            />
          </Form.Group>
          <Button
            type="submit"
            className={styles.regBtn}
            value="createAgendaFolder"
            data-testid="createAgendaFolderFormSubmitBtn"
          >
            {t('createAgendaFolder')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaFolderCreateModal;
