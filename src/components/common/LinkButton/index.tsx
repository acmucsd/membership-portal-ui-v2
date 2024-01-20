import type { URL } from '@/lib/types';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import style from './style.module.scss';

interface IProps {
  variant?: 'primary' | 'secondary';
  destructive?: boolean;
  href: URL;
  size?: 'default' | 'small';
}

const LinkButton = (props: PropsWithChildren<IProps>) => {
  const { variant = 'primary', destructive = false, href, size = 'default', children } = props;

  return (
    <Link
      className={style.button}
      data-variant={variant}
      data-destructive={destructive}
      data-size={size}
      href={href}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
