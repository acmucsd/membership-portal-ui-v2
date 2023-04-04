import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

const ContentView = ({ children }: PropsWithChildren) => (
  <div className={styles.content}>{children}</div>
);

export default ContentView;
