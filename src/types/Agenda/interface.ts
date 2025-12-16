import type { ChangeEvent } from 'react';

export interface InterfaceAgendaItemCategoryInfo {
  id: string;
  name: string;
  //description: string;
  creator: {
    id: string;
    name: string;
  };
}

export interface InterfaceCreateFormStateType {
  folderId: string | null;
  title: string;
  description: string;
  duration: string;
  attachments: string[];
  urls: string[];
}

export interface InterfaceFormStateType {
  folderId: string | null;
  agendaItemCategoryNames: string[];
  key: string;
  title: string;
  description: string;
  duration: string;
  attachments: string[];
  urls: string[];
  creator: {
    id: string;
    name: string;
  };
}

export interface InterfaceAgendaItemsCreateModalProps {
  agendaItemCreateModalIsOpen: boolean;
  hideCreateModal: () => void;
  formState: InterfaceCreateFormStateType;
  setFormState: (
    state: React.SetStateAction<InterfaceCreateFormStateType>,
  ) => void;
  createAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
}

export interface InterfaceAgendaItemsPreviewModalProps {
  agendaItemPreviewModalIsOpen: boolean;
  hidePreviewModal: () => void;
  showUpdateModal: () => void;
  toggleDeleteModal: () => void;
  formState: InterfaceFormStateType;
  t: (key: string) => string;
}

export interface InterfaceAgendaItemsUpdateModalProps {
  agendaItemUpdateModalIsOpen: boolean;
  hideUpdateModal: () => void;
  formState: InterfaceFormStateType;
  setFormState: (state: React.SetStateAction<InterfaceFormStateType>) => void;
  updateAgendaItemHandler: (e: ChangeEvent<HTMLFormElement>) => Promise<void>;
  t: (key: string) => string;
  agendaItemCategories: InterfaceAgendaItemCategoryInfo[] | undefined;
}

export interface InterfaceAgendaItemsDeleteModalProps {
  agendaItemDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  deleteAgendaItemHandler: () => Promise<void>;
  t: (key: string) => string;
  tCommon: (key: string) => string;
}
