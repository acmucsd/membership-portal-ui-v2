import Step1 from '@/public/assets/graphics/store/step1.svg';
import Step2 from '@/public/assets/graphics/store/step2.svg';
import Step3 from '@/public/assets/graphics/store/step3.svg';
import Step4 from '@/public/assets/graphics/store/step4.svg';
import CloseIcon from '@/public/assets/icons/close-icon.svg';
import { useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal = ({ open, onClose }: HelpModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.addEventListener('click', e => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    });
  }, [onClose]);

  useEffect(() => {
    if (ref.current && open) {
      ref.current.showModal();
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
          onClose();
        }
      }}
      onClose={onClose}
    >
      <form method="dialog" className={styles.modalBody}>
        <div className={styles.header}>
          <h1>How does the ACM Store work?</h1>
          <button type="submit" className={styles.close} aria-label="Close">
            <CloseIcon aria-hidden />
          </button>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <Step1 aria-label="Raccoons sitting about on a picnic blanket." />
            <p>Attend events to get membership points!</p>
          </div>
          <div className={styles.step}>
            <Step2 aria-label="A raccoon with a laptop delighted by a pink hoodie." />
            <p>Spend your points here on items.</p>
          </div>
          <div className={styles.step}>
            <Step3 aria-label='A dropdown labelled "Pickup Date," then a shopper raccoon with a tote bag stops by at a table with a tablecloth and a stack of neatly folded hoodies, at which a helpful raccoon from ACM is stationed.' />
            <p>Select a pickup event for your order.</p>
          </div>
          <div className={styles.step}>
            <Step4 aria-label="A happy raccoon celebrates and dances with its new pink hoodie." />
            <p>Pick up your merch and show your ACM spirit! </p>
          </div>
        </div>
      </form>
    </dialog>
  );
};

export default HelpModal;
