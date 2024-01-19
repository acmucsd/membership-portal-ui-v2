import { Modal } from '@/components/common';
import Step1 from '@/public/assets/graphics/store/step1.svg';
import Step2 from '@/public/assets/graphics/store/step2.svg';
import Step3 from '@/public/assets/graphics/store/step3.svg';
import Step4 from '@/public/assets/graphics/store/step4.svg';
import ArrowLeftIcon from '@/public/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/public/assets/icons/arrow-right.svg';
import type { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface StepProps {
  step: number;
}

const Step = ({ step, children }: PropsWithChildren<StepProps>) => {
  const Left = step > 1 ? 'a' : 'span';
  const Right = step < 4 ? 'a' : 'span';
  return (
    <div className={styles.step} id={`step-${step}`}>
      {children}
      <div className={styles.stepControls}>
        <Left className={styles.stepControl} href={`#step-${step - 1}`}>
          <ArrowLeftIcon aria-label="Previous page" />
        </Left>
        <Right className={styles.stepControl} href={`#step-${step + 1}`}>
          <ArrowRightIcon aria-label="Next page" />
        </Right>
      </div>
    </div>
  );
};

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

const HelpModal = ({ open, onClose }: HelpModalProps) => {
  return (
    // Justification for disabling eslint rules: Clicking on the faded area
    // isn't the only way to close the modal; you can also click the close
    // button. HTML already supports pressing the escape key to close modals, so
    // I don't need to add my own.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <Modal title="How does the ACM Store work?" open={open} onClose={onClose}>
      <div className={styles.steps}>
        <Step step={1}>
          <Step1 aria-label="Raccoons sitting about on a picnic blanket." />
          <p>Attend events to get membership points!</p>
        </Step>
        <Step step={2}>
          <Step2 aria-label="A raccoon with a laptop delighted by a pink hoodie." />
          <p>Spend your points here on items.</p>
        </Step>
        <Step step={3}>
          <Step3 aria-label='A dropdown labelled "Pickup Date," then a shopper raccoon with a tote bag stops by at a table with a tablecloth and a stack of neatly folded hoodies, at which a helpful raccoon from ACM is stationed.' />
          <p>Select a pickup event for your order.</p>
        </Step>
        <Step step={4}>
          <Step4 aria-label="A happy raccoon celebrates and dances with its new pink hoodie." />
          <p>Pick up your merch and show your ACM spirit! </p>
        </Step>
      </div>
    </Modal>
  );
};

export default HelpModal;
