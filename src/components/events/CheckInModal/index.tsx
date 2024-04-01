import { Modal, Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicEvent } from '@/lib/types/apiResponses';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import style from './style.module.scss';

interface CheckInModalProps {
  open: boolean;
  event?: PublicEvent;
  onClose: () => void;
}

const CHECKIN_TITLES: string[] = [
  'Yippee!',
  'Brilliant!',
  'Wahoo!',
  'Awesome!',
  'Nice to see you!',
  'Congrats!',
  'Hello World!',
  'Welcome!',
];

// This is a mix of community colors and colors taken from the ACM rainbow.
const colors: string[] = [
  '#e981a0',
  '#f9a857',
  '#51c0c0',
  '#62b0ff',
  '#816dff',
  style.general,
  style.hack,
  style.cyber,
  style.ai,
  style.design,
  style.innovate,
];

const drawDiamond = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(0, 15);
  ctx.lineTo(15, 0);
  ctx.lineTo(0, -15);
  ctx.stroke();
  ctx.closePath();
  ctx.fill();
};

const CheckInModal = ({ open, event, onClose }: CheckInModalProps) => {
  const headerText = useMemo(
    () => CHECKIN_TITLES[Math.floor(Math.random() * CHECKIN_TITLES.length)],
    []
  );

  const [refreshConfetti, setRefreshConfetti] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setRefreshConfetti((r: boolean) => !r);
    }
  }, [open]);

  if (!event) {
    return null;
  }

  const { pointValue, title } = event;

  return (
    <Modal open={open} onClose={onClose}>
      <Confetti
        key={`${refreshConfetti}`}
        numberOfPieces={1000}
        initialVelocityY={-10}
        tweenDuration={15000}
        recycle={false}
        drawShape={drawDiamond}
        colors={colors}
      />
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
        <div className={style.buttonRow}>
          <Link
            href={`${config.eventsRoute}/${event.uuid}`}
            className={`${style.button} ${style.addFeedback}`}
          >
            <Typography variant="h4/bold">Add Feedback</Typography>
          </Link>
          <button type="submit" className={style.button}>
            <Typography variant="h4/bold">Close</Typography>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CheckInModal;
