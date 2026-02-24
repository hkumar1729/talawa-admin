import React from 'react';
import { Card } from 'react-bootstrap';
import Button from 'shared-components/Button';
import styles from './SecuritySettingCard.module.css';

export interface InterfaceSecuritySettingCardProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SecuritySettingCard: React.FC<InterfaceSecuritySettingCardProps> = ({
  title,
  description,
  buttonLabel,
  onClick,
  disabled,
  children,
}) => {
  return (
    <Card className={styles.securityCard}>
      <Card.Body className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.title}>{title}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
          {children}
        </div>

        {buttonLabel && (
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={onClick}
            disabled={disabled}
            data-testid="security-card-btn"
          >
            {buttonLabel}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default SecuritySettingCard;
