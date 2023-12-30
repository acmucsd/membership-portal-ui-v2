import type { ReactNode } from 'react';
import styles from './style.module.scss';

interface CarouselProps {
  children: ReactNode[];
}

const Carousel = ({ children }: CarouselProps) => {
  return <div className={styles.slider}>{children}</div>;
};

export default Carousel;
