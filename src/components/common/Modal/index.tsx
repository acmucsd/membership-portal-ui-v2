import CloseIcon from '@/public/assets/icons/close-icon.svg';
import { ReactNode, useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface ModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  // Anchor content to the bottom of the screen. Primarily for mobile modals.
  bottomSheet?: boolean;
}

const Modal = ({ title, open, onClose, children, bottomSheet }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const scrollPosition = useRef<number>(0);

  useEffect(() => {
    /**
     * In order to stop the body behind the modal from scrolling in iOS,
     * we need to add position: fixed and overflow: hidden to body and html (this is done in globals.scss)
     *
     * A side effect of this is that the position is reset to the top of the page every time the modal
     * resets. We address this by saving and restoring the scroll position every time we close a modal.
     */
    const body = document.querySelector('body');

    const saveScrollPosition = () => {
      scrollPosition.current = window.scrollY;
      if (body) {
        body.style.top = `-${scrollPosition}px`;
      }
    };
    const restoreScrollPosition = () => {
      if (body) {
        body.style.removeProperty('top');
        window.scrollTo(0, scrollPosition.current);
      }
    };

    if (open) {
      saveScrollPosition();
      ref.current?.showModal();
    } else {
      restoreScrollPosition();
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
      className={`${styles.modal} ${bottomSheet ? styles.bottomSheet : ''}`}
      ref={ref}
      onClick={e => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
      }}
      onClose={onClose}
    >
      <form
        method="dialog"
        className={`${styles.modalBody} ${title ? styles.hasHeader : ''} ${
          bottomSheet ? styles.bottomSheet : ''
        }`}
      >
        {title && (
          <div className={styles.header}>
            <h1>{title}</h1>
            <button type="submit" className={styles.close} aria-label="Close">
              <CloseIcon aria-hidden />
            </button>
          </div>
        )}
        {children}
      </form>
    </dialog>
  );
};

export default Modal;
