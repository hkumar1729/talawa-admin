/**
 * AgendaItemsCreateModal Component
 *
 * This component renders a modal for creating agenda items. It includes
 * form fields for entering details such as title, duration, description,
 * categories, URLs, and attachments. The modal also provides functionality
 * for validating URLs, managing attachments, and submitting the form.
 *
 * @component
 * @param {InterfaceAgendaItemsCreateModalProps} props - The props for the component.
 * @param {boolean} props.agendaItemCreateModalIsOpen - Determines if the modal is open.
 * @param {() => void} props.hideCreateModal - Function to close the modal.
 * @param {object} props.formState - The current state of the form.
 * @param {React.Dispatch<React.SetStateAction<object>>} props.setFormState - Function to update the form state.
 * @param {() => void} props.createAgendaItemHandler - Function to handle form submission.
 * @param {(key: string) => string} props.t - Translation function for localization.
 * @param {InterfaceAgendaItemCategoryInfo[]} props.agendaItemCategories - List of available agenda item categories.
 *
 * @returns {JSX.Element} The rendered modal component.
 *
 * @remarks
 * - The component uses `react-bootstrap` for modal and form styling.
 * - `@mui/material` is used for the Autocomplete component.
 * - Attachments are converted to base64 format before being added to the form state.
 * - URLs are validated using a regular expression before being added.
 *
 * @example
 * ```tsx
 * <AgendaItemsCreateModal
 *   agendaItemCreateModalIsOpen={true}
 *   hideCreateModal={handleClose}
 *   formState={formState}
 *   setFormState={setFormState}
 *   createAgendaItemHandler={handleSubmit}
 *   t={translate}
 *   agendaItemCategories={categories}
 * />
 * ```
 */
import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { Autocomplete, TextField } from '@mui/material';

import { FaLink, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../../../style/app-fixed.module.css';
import { useMinioUpload } from 'utils/MinioUpload';
import { useMinioDownload } from 'utils/MinioDownload';
import type {
  InterfaceAgendaItemsCreateModalProps,
  InterfaceAttachment,
} from 'types/Agenda/interface';
import { useParams } from 'react-router';

const AgendaItemsCreateModal: React.FC<
  InterfaceAgendaItemsCreateModalProps
> = ({
  agendaItemCreateModalIsOpen,
  hideItemCreateModal,
  agendaItemFormState,
  setAgendaItemFormState,
  createAgendaItemHandler,
  t,
  agendaItemCategories,
  agendaFolderData,
}) => {
  const [newUrl, setNewUrl] = useState('');
  const { uploadFileToMinio } = useMinioUpload();
  const { getFileFromMinio } = useMinioDownload();
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const { orgId } = useParams();
  const organizationId = orgId ?? 'organization';
  console.log('agendaItemCategories', agendaItemCategories);

  const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ];

  /**
   * Validates if a given URL is in a correct format.
   *
   * @param url - URL string to validate.
   * @returns True if the URL is valid, false otherwise.
   */
  const isValidUrl = (url: string): boolean => {
    // Regular expression for basic URL validation
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  /**
   * Handles adding a new URL to the form state.
   *
   * Checks if the URL is valid before adding it.
   */
  const handleAddUrl = (): void => {
    if (newUrl.trim() !== '' && isValidUrl(newUrl.trim())) {
      setAgendaItemFormState({
        ...agendaItemFormState,
        urls: [
          ...agendaItemFormState.urls.filter((url) => url.trim() !== ''),
          newUrl,
        ],
      });
      setNewUrl('');
    } else {
      toast.error(t('invalidUrl'));
    }
  };

  /**
   * Handles removing a URL from the form state.
   *
   * @param url - URL to remove.
   */
  const handleRemoveUrl = (url: string): void => {
    setAgendaItemFormState({
      ...agendaItemFormState,
      urls: agendaItemFormState.urls.filter((item) => item !== url),
    });
  };

  /**
   * Handles file selection and converts files to base64 before updating the form state.
   *
   * @param e - File input change event.
   */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const target = e.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;

    const files = Array.from(target.files);

    try {
      const uploadedAttachments: InterfaceAttachment[] = [];

      for (const file of files) {
        // Size check
        if (file.size > MAX_FILE_SIZE_BYTES) {
          toast.error(t('fileSizeExceedsLimit'));
          continue;
        }

        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          toast.error(
            t('invalidFileType') ||
              'Invalid file type. Only images and videos are allowed.',
          );
          continue;
        }

        const { objectName, fileHash } = await uploadFileToMinio(
          file,
          organizationId,
        );

        const previewUrl = await getFileFromMinio(objectName, organizationId);

        uploadedAttachments.push({
          mimeType: file.type,
          objectName,
          fileHash,
          previewUrl,
        });
      }

      if (uploadedAttachments.length > 0) {
        setAgendaItemFormState((prev) => ({
          ...prev,
          attachments: [...prev.attachments, ...uploadedAttachments],
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('fileUploadFailed') || 'File upload failed');
    } finally {
      // allow re-uploading the same file
      target.value = '';
    }
  };

  /**
   * Handles removing an attachment from the form state.
   *
   * @param attachment - Attachment to remove.
   */
  const handleRemoveAttachment = (objectName: string): void => {
    setAgendaItemFormState({
      ...agendaItemFormState,
      attachments: agendaItemFormState.attachments.filter(
        (item) => item.objectName !== objectName,
      ),
    });
  };

  return (
    <Modal
      className={styles.AgendaItemsModal}
      show={agendaItemCreateModalIsOpen}
      onHide={hideItemCreateModal}
    >
      <Modal.Header>
        <p className={styles.titlemodalAgendaItems}>{t('agendaItemDetails')}</p>
        <Button
          variant="danger"
          onClick={hideItemCreateModal}
          data-testid="createAgendaItemModalCloseBtn"
        >
          <i className="fa fa-times"></i>
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createAgendaItemHandler}>
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="folderSelect"
              options={agendaFolderData ?? []}
              value={
                agendaFolderData?.find(
                  (folder) => folder.id === agendaItemFormState.folderId,
                ) || null
              }
              filterSelectedOptions={true}
              getOptionLabel={(folder) => folder.name}
              onChange={(_, folder): void => {
                setAgendaItemFormState({
                  ...agendaItemFormState,
                  folderId: folder?.id ?? null,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label={t('folder')} />
              )}
            />
          </Form.Group>
          <Form.Group className="d-flex mb-3 w-100">
            <Autocomplete
              className={`${styles.noOutline} w-100`}
              limitTags={2}
              data-testid="categorySelect"
              options={agendaItemCategories || []}
              value={
                agendaItemCategories?.find(
                  (category) => category.id === agendaItemFormState.categoryId,
                ) || null
              }
              filterSelectedOptions={true}
              getOptionLabel={(category) => category.name}
              onChange={(_, category): void => {
                setAgendaItemFormState({
                  ...agendaItemFormState,
                  categoryId: category?.id ?? '',
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label={t('category')} />
              )}
            />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>{t('title')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('enterTitle')}
                  value={agendaItemFormState.title}
                  required
                  onChange={(e) =>
                    setAgendaItemFormState({
                      ...agendaItemFormState,
                      title: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="duration">
                <Form.Label>{t('duration')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t('enterDuration')}
                  value={agendaItemFormState.duration}
                  required
                  onChange={(e) =>
                    setAgendaItemFormState({
                      ...agendaItemFormState,
                      duration: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={1}
              placeholder={t('enterDescription')}
              value={agendaItemFormState.description}
              required
              onChange={(e) =>
                setAgendaItemFormState({
                  ...agendaItemFormState,
                  description: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('url')}</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder={t('enterUrl')}
                id="basic-url"
                data-testid="urlInput"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <Button onClick={handleAddUrl} data-testid="linkBtn">
                {t('link')}
              </Button>
            </div>

            {agendaItemFormState.urls.map((url, index) => (
              <li key={index} className={styles.urlListItem}>
                <FaLink className={styles.urlIcon} />
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url.length > 50 ? url.substring(0, 50) + '...' : url}
                </a>
                <Button
                  variant="danger"
                  size="sm"
                  className={styles.deleteButtonAgendaItems}
                  data-testid="deleteUrl"
                  onClick={() => handleRemoveUrl(url)}
                >
                  <FaTrash />
                </Button>
              </li>
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>{t('attachments')}</Form.Label>
            <Form.Control
              accept="image/*, video/*"
              data-testid="attachment"
              name="attachment"
              type="file"
              id="attachment"
              multiple={true}
              onChange={handleFileChange}
            />
            <Form.Text>{t('attachmentLimit')}</Form.Text>
          </Form.Group>
          {agendaItemFormState.attachments
            .filter(
              (att): att is InterfaceAttachment =>
                typeof att === 'object' &&
                !!att.mimeType &&
                !!att.objectName &&
                !!att.previewUrl,
            )
            .map((attachment, index) => (
              <div key={index} className={styles.attachmentPreview}>
                {attachment.mimeType.startsWith('video') ? (
                  <video
                    muted
                    autoPlay
                    loop
                    playsInline
                    crossOrigin="anonymous"
                  >
                    <source
                      src={attachment.previewUrl}
                      type={attachment.mimeType}
                    />
                  </video>
                ) : (
                  <img src={attachment.previewUrl} alt="Attachment preview" />
                )}

                <button
                  className={styles.closeButtonFile}
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveAttachment(attachment.objectName);
                  }}
                  data-testid="deleteAttachment"
                >
                  <i className="fa fa-times" />
                </button>
              </div>
            ))}
          <Button
            type="submit"
            className={styles.greenregbtnAgendaItems}
            value="createAgendaItem"
            data-testid="createAgendaItemFormBtn"
          >
            {t('createAgendaItem')}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AgendaItemsCreateModal;
