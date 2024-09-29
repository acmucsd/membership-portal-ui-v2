import Typography from '@/components/common/Typography';
import type { URL } from '@/lib/types';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import style from './style.module.scss';

interface IProps {
  variant?: 'primary' | 'secondary';
  destructive?: boolean;
  href: URL;
  size?: 'default' | 'small';
  onClick?: () => void;
}

const LinkButton = (props: PropsWithChildren<IProps>) => {
  const {
    variant = 'primary',
    destructive = false,
    href,
    size = 'default',
    onClick,
    children,
  } = props;

  return (
    <Link
      className={style.button}
      data-variant={variant}
      data-destructive={destructive}
      data-size={size}
      href={href}
      onClick={onClick}
    >
      <Typography variant="h5/medium" component="span">
        {children}
      </Typography>
    </Link>
  );
};

export default LinkButton;
