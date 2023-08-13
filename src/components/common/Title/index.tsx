import { ReactNode } from 'react';
import styles from './style.module.scss';

interface TitleProps {
  type?: 'h1' | 'h2' | 'h3';
  heading: string;
  children?: ReactNode;
  className?: string;
}

const Title = ({ type: Heading = 'h1', heading, children, className = '' }: TitleProps) => {
  // `Heading` has to be capitalized for React to use it as a variable name.
  // Otherwise, <heading></heading> will be treated as a literal `<heading>`
  // element.
  return (
    <div className={`${styles.header} ${className}`}>
      <Heading className={styles.heading}>{heading}</Heading>
      {children}
    </div>
  );
};

export default Title;
