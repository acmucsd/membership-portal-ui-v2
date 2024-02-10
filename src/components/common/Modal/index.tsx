import CloseIcon from '@/public/assets/icons/close-icon.svg';
import { ReactNode, useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface ModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const Modal = ({ title, open, onClose, children }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    // Justification for disabling eslint rules: Clicking on the faded area
    // isn't the only way to close the modal; you can also click the close
    // button. HTML already supports pressing the escape key to close modals, so
    // I don't need to add my own.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      className={styles.modal}
      ref={ref}
      onClick={e => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
      }}
      onClose={onClose}
    >
      <form method="dialog" className={`${styles.modalBody} ${title ? styles.hasHeader : ''}`}>
        {title ? (
          <div className={styles.header}>
            <h1>{title}</h1>
            <button type="submit" className={styles.close} aria-label="Close">
              <CloseIcon aria-hidden />
            </button>
          </div>
        ) : null}
        {children}
      </form>
    </dialog>
  );
};

export default Modal;
