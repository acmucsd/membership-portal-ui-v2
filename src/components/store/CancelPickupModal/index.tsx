import { Button, Modal, Typography } from '@/components/common';
import { reportError } from '@/lib/utils';
import CloseIcon from '@/public/assets/icons/close-icon.svg';
import styles from './style.module.scss';

interface CancelPickupModalProps {
  open: boolean;
  onClose: () => void;
  cancelOrder: () => Promise<void>;
}

const CancelPickupModal = ({ open, onClose, cancelOrder }: CancelPickupModalProps) => {
  const onCancel = () => {
    cancelOrder()
      .catch(e => reportError('Error cancelling order', e))
      .finally(onClose);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2/bold" className={styles.heading}>
            Cancel Order
          </Typography>
          <button type="submit" className={styles.close} aria-label="Close">
            <CloseIcon aria-hidden />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.bodyText}>
            <Typography variant="h3/bold" className={styles.text}>
              Are you sure you want to cancel this order?
            </Typography>
            <Typography variant="h3/regular" className={styles.text}>
              Points will be refunded to your account.
            </Typography>
          </div>
          <div className={styles.buttons}>
            <Button onClick={onCancel} destructive>
              Cancel Order
            </Button>
            <Button variant="secondary" submit>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CancelPickupModal;
