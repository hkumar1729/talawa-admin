import React from 'react';

import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { PasswordField } from 'shared-components/Auth/PasswordField/PasswordField';

export interface InterfacePasswordUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;

  values: {
    oldPassword?: string;
    newPassword: string;
    confirmNewPassword: string;
  };

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  hidePreviousPassword?: boolean;
  title: string;
  saveText: string;
  oldPasswordLabel: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
}

export const PasswordUpdateModal: React.FC<
  InterfacePasswordUpdateModalProps
> = ({
  open,
  onClose,
  onSubmit,
  values,
  onChange,
  hidePreviousPassword = false,
  title,
  saveText,
  oldPasswordLabel,
  newPasswordLabel,
  confirmPasswordLabel,
}) => {
  return (
    <CRUDModalTemplate
      open={open}
      title={title}
      onClose={onClose}
      onPrimary={onSubmit}
      primaryText={saveText}
      data-testid="update-password-modal"
    >
      {!hidePreviousPassword && (
        <PasswordField
          label={oldPasswordLabel}
          name="oldPassword"
          value={values.oldPassword ?? ''}
          onChange={onChange}
          testId="previousPasswordField"
        />
      )}

      <PasswordField
        label={newPasswordLabel}
        name="newPassword"
        value={values.newPassword}
        onChange={onChange}
        testId="newPasswordField"
      />

      <PasswordField
        label={confirmPasswordLabel}
        name="confirmNewPassword"
        value={values.confirmNewPassword}
        onChange={onChange}
        testId="confirmPasswordField"
      />
    </CRUDModalTemplate>
  );
};

export default PasswordUpdateModal;
