import { Modal, Typography } from '@/components/common';
import { PublicEvent } from '@/lib/types/apiResponses';
import Image from 'next/image';
import { useMemo } from 'react';
import style from './style.module.scss';

interface CheckInModalProps {
  open: boolean;
  event?: PublicEvent;
  onClose: () => void;
}

const CHECKIN_TITLES = [
  'Yippee!',
  'Brilliant!',
  'Wahoo!',
  'Awesome!',
  'Nice to see you!',
  'Congrats!',
  'Hello World!',
  'Welcome!',
];

const CheckInModal = ({ open, event, onClose }: CheckInModalProps) => {
  const headerText = useMemo(
    () => CHECKIN_TITLES[Math.floor(Math.random() * CHECKIN_TITLES.length)],
    []
  );

  if (!event) {
    return null;
  }

  const { pointValue, title } = event;

  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.container}>
        <div className={style.graphic}>
          <Image
            src="/assets/graphics/portal/treasure.svg"
            alt="A diamond with a smiley face looks at an open treasure chest."
            fill
          />
        </div>
        <div className={style.header}>
          <Typography
            variant="display/light/small"
            className={style.headerText}
            suppressHydrationWarning
          >
            {headerText}
          </Typography>
          <div className={style.subheader}>
            <Typography variant="h4/regular" component="span" className={style.subheaderText}>
              {'You just earned '}
              <strong>{pointValue}</strong>
              {' membership points for checking into '}
              <strong>{title}</strong>!
            </Typography>
            <Typography variant="h4/regular" className={style.subheaderText} />
          </div>
        </div>
        <button type="submit" className={style.done}>
          <Typography variant="h4/bold">Done</Typography>
        </button>
      </div>
    </Modal>
  );
};

export default CheckInModal;
