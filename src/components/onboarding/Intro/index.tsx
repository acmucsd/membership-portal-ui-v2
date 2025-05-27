import BitByteAllocation from '@/public/assets/graphics/onboarding/Fall23Allocation-JustinLu.jpg';
import BitByteInfoSession from '@/public/assets/graphics/onboarding/Fall24BitByteInfo_1-JustinLu.jpg';
import BitByteSpeedFriending from '@/public/assets/graphics/onboarding/Fall24BitByteInfo_2-JustinLu.jpg';
import BonfireMarshmellows from '@/public/assets/graphics/onboarding/Fall24Bonfire_1-JustinLu.jpg';
import BonfireBeach from '@/public/assets/graphics/onboarding/Fall24Bonfire_2-JustinLu.jpg';
import KickoffSideView from '@/public/assets/graphics/onboarding/Fall24Kickoff_1-JustinLu.jpg';
import KickoffCloseUp from '@/public/assets/graphics/onboarding/Fall24Kickoff_2-JustinLu.jpg';
import KickoffFrontView from '@/public/assets/graphics/onboarding/Fall24Kickoff_3-JustinLu.jpg';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

type ImageBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getCenter({ x, y, width, height }: ImageBounds): { x: number; y: number } {
  return { x: x + width / 2, y: y + height / 2 };
}

type IntroImage = {
  src: StaticImageData;
  alt: string;
  desktopSize: ImageBounds;
  mobileSize: ImageBounds;
  round?: boolean;
};

// Measurements from
// https://www.figma.com/design/GiWZdbzJ2uxyknpCrB9UK6/acm-onboarding, ordered
// from bottom to top (reversed from Figma, where layers are ordered top to
// bottom)
const firstImage = {
  src: KickoffFrontView,
  alt: 'A large audience of students forming diamonds with their hands',
  desktopSize: { x: 173, y: 116, width: 631, height: 308 },
  mobileSize: { x: 12, y: 173, width: 287, height: 206 },
  round: true,
};
const images: IntroImage[] = [
  firstImage,
  {
    src: BonfireBeach,
    alt: 'Students standing on a beach on a cloudy day',
    desktopSize: { x: 289, y: 29, width: 326, height: 146 },
    mobileSize: { x: 0, y: 116, width: 146, height: 110 },
  },
  {
    src: BitByteAllocation,
    alt: 'A group photo of students standing before Geisel and Snake Path',
    desktopSize: { x: 57, y: 357, width: 299, height: 135 },
    mobileSize: { x: 0, y: 422, width: 270, height: 131 },
  },
  {
    src: KickoffSideView,
    alt: 'A large audience of students at ACM Kickoff',
    desktopSize: { x: 327, y: 390, width: 393, height: 134 },
    mobileSize: { x: 0, y: 0, width: 252, height: 108 },
    round: true,
  },
  {
    src: BitByteInfoSession,
    alt: 'An audience of students watching a presentation',
    desktopSize: { x: 685, y: 72, width: 233, height: 135 },
    mobileSize: { x: 124, y: 369, width: 187, height: 84 },
  },
  {
    src: BitByteSpeedFriending,
    alt: 'Students chatting',
    desktopSize: { x: 49, y: 175, width: 138, height: 138 },
    mobileSize: { x: 213, y: 293, width: 86, height: 86 },
    round: true,
  },
  {
    src: BonfireMarshmellows,
    alt: 'Students around a bonfire holding marshmellows on skewers',
    desktopSize: { x: 740, y: 285, width: 208, height: 208 },
    mobileSize: { x: 158, y: 86, width: 153, height: 153 },
    round: true,
  },
  {
    src: KickoffCloseUp,
    alt: 'A student smiling in a crowd',
    desktopSize: { x: 89, y: 46, width: 168, height: 168 },
    mobileSize: { x: 24, y: 326, width: 109, height: 109 },
    round: true,
  },
];
// The center of the coordinate system
const DESKTOP_OFFSET = getCenter(firstImage.desktopSize);
const MOBILE_OFFSET = getCenter(firstImage.mobileSize);

const displayImage = (
  mode: 'desktop' | 'mobile',
  { src, alt, round, ...sizes }: IntroImage,
  index: number
) => {
  const { x, y, width, height } = sizes[`${mode}Size`];
  const offset = mode === 'desktop' ? DESKTOP_OFFSET : MOBILE_OFFSET;
  return (
    <Image
      className={`${styles.image} ${round ? styles.pill : ''} ${styles[`${mode}Only`]}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        left:
          mode === 'desktop'
            ? `${x - offset.x}px`
            : // Widen the mobile image layout as the screen gets wider
              `calc(${x - offset.x}px + ${(x - offset.x + width / 2) * 0.2}vw)`,
        top: `${y - offset.y}px`,
        transformOrigin: `${offset.x - x}px ${offset.y - y}px`,
        animationDelay: `${index * 0.1 + 0.5}s`,
        animationDuration: `${index * 0.05 + 1}s`,
      }}
    />
  );
};

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
        {images.map((image, i) => (
          <div
            key={image.src.src}
            className={styles.imageWrapper}
            style={{
              transform: `translate(${mouseX / (10 + images.length - i)}px, ${
                mouseY / (10 + images.length - i)
              }px)`,
            }}
          >
            {displayImage('desktop', image, i)}
            {displayImage('mobile', image, i)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Intro;
