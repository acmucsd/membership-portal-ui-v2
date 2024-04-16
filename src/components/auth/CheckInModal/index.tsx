import ModalCard from '@/components/auth/ModalCard';
import { Modal } from '@/components/common';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './style.module.scss';

interface CheckInModalProps {
  open: boolean;
}

const CheckInModal = ({ open }: CheckInModalProps) => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(open);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const CardContents = [
    {
      title: 'Have an account?',
      subtitle: 'We missed you, welcome back. Login to get your points!',
      onClick: () => {
        handleModalClose();
      },
    },
    {
      title: 'New to ACM?',
      subtitle: 'Express check-in to your first event with just your email!',
      onClick: () => {
        // Push to /express with the current query params
        router.push({ pathname: '/express', query: router.query });
      },
    },
  ];

  return (
    // Justification for disabling eslint rules: Clicking on the faded area
    // isn't the only way to close the modal; you can also click the close
    // button. HTML already supports pressing the escape key to close modals, so
    // I don't need to add my own.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <Modal
      title="To finish checking in, sign in to your account!"
      open={isModalOpen}
      onClose={handleModalClose}
    >
      <div className={styles.contents}>
        <div className={styles.cardContainer}>
          {CardContents.map(card => (
            <ModalCard
              key={card.subtitle}
              title={card.title}
              subtitle={card.subtitle}
              onClick={card.onClick}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default CheckInModal;
