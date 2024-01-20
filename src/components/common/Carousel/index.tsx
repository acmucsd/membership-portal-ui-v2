import type { PropsWithChildren } from 'react';
import styles from './style.module.scss';

const Carousel = ({ children }: PropsWithChildren) => {
  return <div className={styles.slider}>{children}</div>;
};

export default Carousel;
