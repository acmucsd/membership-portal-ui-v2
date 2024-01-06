import { Modal, Typography } from '@/components/common';
import { PropsWithChildren, ReactElement, cloneElement, useState } from 'react';
import styles from './style.module.scss';

interface StoreModalProps {
  opener: ReactElement<any>;
  title: string;
  onConfirm?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
}

/**
 * A wrapper for a modal in store style with 'Confirm' and 'Go back' buttons
 * @param props.opener - a button to open the modal on click
 * @param props.title - title for modal card
 * @param props.onConfirm - called when confirm button is clicked
 * @param props.onCancel - called when modal is closed any way other than the confirm button
 * @returns wrapper including opener and modal
 */
const StoreModal = ({
  opener,
  title,
  onConfirm = () => {},
  onCancel = () => {},
  children,
}: PropsWithChildren<StoreModalProps>) => {
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
              >
                <Typography variant="h4/medium">Confirm</Typography>
              </button>
              <button type="button" onClick={onClose}>
                <Typography variant="h4/medium">Go back</Typography>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StoreModal;
