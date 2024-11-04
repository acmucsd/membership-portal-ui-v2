import Allocation from '@/public/assets/graphics/onboarding/ACM_Fall23Allocation-JustinLu.jpg';
import HoldBoba from '@/public/assets/graphics/onboarding/ACM_Fall24BitByteInfo_1-JustinLu.jpg';
import Murou from '@/public/assets/graphics/onboarding/ACM_Fall24BitByteInfo_2-JustinLu.jpg';
import Bonfire from '@/public/assets/graphics/onboarding/ACM_Fall24Bonfire_1-JustinLu.jpg';
import RaymondBack from '@/public/assets/graphics/onboarding/ACM_Fall24Bonfire_2-JustinLu.jpg';
import TiltKickoff from '@/public/assets/graphics/onboarding/ACM_Fall24Kickoff_1-JustinLu.jpg';
import FocusPerson from '@/public/assets/graphics/onboarding/ACM_Fall24Kickoff_2-JustinLu.jpg';
import KickoffBig from '@/public/assets/graphics/onboarding/ACM_Fall24Kickoff_3-JustinLu.jpg';
import Image, { StaticImageData } from 'next/image';
import styles from './style.module.scss';

type IntroImage = {
  src: StaticImageData;
  size: [x: number, y: number, width: number, height: number];
  round?: boolean;
};

const images: IntroImage[] = [
  { src: FocusPerson, size: [89, 46, 168, 168], round: true },
  { src: Bonfire, size: [740, 285, 208, 208], round: true },
  { src: Murou, size: [49, 175, 138, 138], round: true },
  { src: HoldBoba, size: [685, 72, 233, 135] },
  { src: RaymondBack, size: [289, 29, 326, 146] },
  { src: TiltKickoff, size: [327, 390, 393, 134], round: true },
  { src: Allocation, size: [57, 357, 299, 135] },
  { src: KickoffBig, size: [173, 116, 631, 308], round: true },
];
images.reverse();
const OFFSET_X = 173 + 631 / 2;
const OFFSET_Y = 116 + 308 / 2;

const Intro = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.anchor}>
        {images.map(({ src, size: [x, y, width, height], round }, i) => (
          <Image
            key={src.src}
            className={`${styles.image} ${round ? styles.pill : ''}`}
            src={src}
            alt="todo"
            width={width}
            height={height}
            style={{
              left: `${x - OFFSET_X}px`,
              top: `${y - OFFSET_Y}px`,
              transformOrigin: `${OFFSET_X - x}px ${OFFSET_Y - y}px`,
              animationDelay: `${i * 0.1 + 0.5}s`,
              animationDuration: `${i * 0.05 + 1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Intro;
