import { Modal, Typography } from '@/components/common';
import { PropsWithChildren, ReactElement, cloneElement, useState } from 'react';
import styles from './style.module.scss';

interface StoreConfirmModalProps {
  /** a button to open the modal on click */
  opener: ReactElement<any>;
  /** title for modal card */
  title: string;
  /** called when confirm button is clicked */
  onConfirm?: (...args: any[]) => any;
  /** called when modal is closed any way other than the confirm button */
  onCancel?: (...args: any[]) => any;
  /** make confirm button red and say "remove" */
  confirmRemove?: boolean;
}

/**
 * A wrapper for a modal in store style with 'Confirm' and 'Go back' buttons
 * @returns wrapper including opener and modal
 */
const StoreConfirmModal = ({
  opener,
  title,
  onConfirm = () => {},
  onCancel = () => {},
  confirmRemove = false,
  children,
}: PropsWithChildren<StoreConfirmModalProps>) => {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    onCancel();
  };

  return (
    <>
      {cloneElement(opener, {
        onClick: () => {
          if (opener.props.onClick) opener.props.onClick();
          setOpen(true);
        },
      })}
      <Modal open={open} onClose={onClose}>
        <div className={styles.card}>
          <div className={styles.header}>
            <Typography variant="h4/bold" component="h1">
              {title}
            </Typography>
          </div>
          <div className={styles.body}>
            {children}
            <div className={styles.options}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
                className={confirmRemove ? styles.confirmRemove : styles.confirm}
              >
                <Typography variant="h4/medium" component="span">
                  {confirmRemove ? 'Remove' : 'Confirm'}
                </Typography>
              </button>
              <button type="button" onClick={onClose} className={styles.cancel}>
                <Typography variant="h4/medium" component="span">
                  Cancel
                </Typography>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StoreConfirmModal;
