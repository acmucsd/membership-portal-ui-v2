import type { URL } from '@/lib/types';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import styles from './style.module.scss';

interface LinkInterface {
  type: 'link';
  href: URL;
  text: string | ReactNode;
}

interface ButtonInterface {
  type: 'button';
  onClick: () => void;
  text: string;
}

interface DisplayOptions {
  display: 'link' | 'button1' | 'button2';
  style?: CSSProperties;
}

type SignInButtonProps = (LinkInterface | ButtonInterface) & DisplayOptions;

const SignInButton = (props: SignInButtonProps) => {
  const { type, text, display, style = {} } = props;

  if (type === 'link') {
    const { href } = props;
    return (
      <Link href={href} style={style} className={styles[display]}>
        {text}
      </Link>
    );
  }

  if (type === 'button') {
    const { onClick } = props;
    return (
      <button type="button" onClick={onClick} style={style} className={styles[display]}>
        {text}
      </button>
    );
  }
  return null;
};

export default SignInButton;
