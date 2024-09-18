import { useEffect, useRef } from 'react';
import styles from './style.module.scss';

const OnboardingModal = () => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    // Block interactions with the page
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      className={styles.wrapper}
      ref={dialogRef}
      // Prevent closing dialog with escape key (TODO: on Chrome you can press
      // escape twice to bypass)
      onCancel={e => e.preventDefault()}
    >
      hey
    </dialog>
  );
};

export default OnboardingModal;
