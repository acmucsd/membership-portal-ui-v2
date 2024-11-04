import Allocation from '@/public/assets/graphics/onboarding/ACM_Fall23Allocation-JustinLu.jpg';
import HoldBoba from '@/public/assets/graphics/onboarding/ACM_Fall24BitByteInfo_1-JustinLu.jpg';
import Murou from '@/public/assets/graphics/onboarding/ACM_Fall24BitByteInfo_2-JustinLu.jpg';
import Bonfire from '@/public/assets/graphics/onboarding/ACM_Fall24Bonfire_1-JustinLu.jpg';
import RaymondBack from '@/public/assets/graphics/onboarding/ACM_Fall24Bonfire_2-JustinLu.jpg';
import TiltKickoff from '@/public/assets/graphics/onboarding/ACM_Fall24Kickoff_1-JustinLu.jpg';
import FocusPerson from '@/public/assets/graphics/onboarding/ACM_Fall24Kickoff_2-JustinLu.jpg';
import KickoffBig from '@/public/assets/graphics/onboarding/ACM_Fall24Kickoff_3-JustinLu.jpg';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

type IntroImage = {
  src: StaticImageData;
  alt: string;
  desktopSize: [x: number, y: number, width: number, height: number];
  mobileSize: [x: number, y: number, width: number, height: number];
  round?: boolean;
};

// https://www.figma.com/design/GiWZdbzJ2uxyknpCrB9UK6/acm-onboarding
const images: IntroImage[] = [
  {
    src: FocusPerson,
    alt: 'A student smiling in a crowd',
    desktopSize: [89, 46, 168, 168],
    mobileSize: [24, 326, 109, 109],
    round: true,
  },
  {
    src: Bonfire,
    alt: 'Students around a bonfire holding marshmellows on skewers',
    desktopSize: [740, 285, 208, 208],
    mobileSize: [158, 86, 153, 153],
    round: true,
  },
  {
    src: Murou,
    alt: 'Students chatting',
    desktopSize: [49, 175, 138, 138],
    mobileSize: [213, 293, 86, 86],
    round: true,
  },
  {
    src: HoldBoba,
    alt: 'An audience of students watching a presentation',
    desktopSize: [685, 72, 233, 135],
    mobileSize: [124, 369, 187, 84],
  },
  {
    src: TiltKickoff,
    alt: 'A large audience of students at ACM Kickoff',
    desktopSize: [327, 390, 393, 134],
    mobileSize: [0, 0, 252, 108],
    round: true,
  },
  {
    src: Allocation,
    alt: 'A group photo of students standing before Geisel and Snake Path',
    desktopSize: [57, 357, 299, 135],
    mobileSize: [0, 422, 270, 131],
  },
  {
    src: RaymondBack,
    alt: 'Students standing on a beach on a cloudy day',
    desktopSize: [289, 29, 326, 146],
    mobileSize: [0, 116, 146, 110],
  },
  {
    src: KickoffBig,
    alt: 'A large audience of students forming diamonds with their hands',
    desktopSize: [173, 116, 631, 308],
    mobileSize: [12, 173, 287, 206],
    round: true,
  },
];
images.reverse();
const DESKTOP_OFFSET_X = 173 + 631 / 2;
const DESKTOP_OFFSET_Y = 116 + 308 / 2;
const MOBILE_OFFSET_X = 25 + 261 / 2;
const MOBILE_OFFSET_Y = 203 + 146 / 2;

const Intro = () => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      if (!ref.current) {
        return;
      }
      const { left, top } = ref.current.getBoundingClientRect();
      setMouseX(e.pointerType === 'mouse' ? e.clientX - left : 0);
      setMouseY(e.pointerType === 'mouse' ? e.clientY - top : 0);
    };
    document.addEventListener('pointermove', handleMouseMove);
    return () => {
      document.removeEventListener('pointermove', handleMouseMove);
    };
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.anchor} ref={ref}>
        {images.map(({ src, alt, desktopSize, mobileSize, round }, i) => (
          <div
            key={src.src}
            className={styles.imageWrapper}
            style={{
              transform: `translate(${mouseX / (10 + images.length - i)}px, ${
                mouseY / (10 + images.length - i)
              }px)`,
            }}
          >
            <Image
              className={`${styles.image} ${round ? styles.pill : ''} ${styles.desktopOnly}`}
              src={src}
              alt={alt}
              width={desktopSize[2]}
              height={desktopSize[3]}
              style={{
                left: `${desktopSize[0] - DESKTOP_OFFSET_X}px`,
                top: `${desktopSize[1] - DESKTOP_OFFSET_Y}px`,
                transformOrigin: `${DESKTOP_OFFSET_X - desktopSize[0]}px ${
                  DESKTOP_OFFSET_Y - desktopSize[1]
                }px`,
                animationDelay: `${i * 0.1 + 0.5}s`,
                animationDuration: `${i * 0.05 + 1}s`,
              }}
            />
            <Image
              className={`${styles.image} ${round ? styles.pill : ''} ${styles.mobileOnly}`}
              src={src}
              alt={alt}
              width={mobileSize[2]}
              height={mobileSize[3]}
              style={{
                left: `calc(${mobileSize[0] - MOBILE_OFFSET_X}px + ${
                  (mobileSize[0] - MOBILE_OFFSET_X + mobileSize[2] / 2) * 0.2
                }vw)`,
                top: `${mobileSize[1] - MOBILE_OFFSET_Y}px`,
                transformOrigin: `${MOBILE_OFFSET_X - mobileSize[0]}px ${
                  MOBILE_OFFSET_Y - mobileSize[1]
                }px`,
                animationDelay: `${i * 0.1 + 0.5}s`,
                animationDuration: `${i * 0.05 + 1}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Intro;
