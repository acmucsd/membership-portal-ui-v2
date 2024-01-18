import { PropsWithChildren } from 'react';
import style from './style.module.scss';

interface IProps {
  variant?: 'primary' | 'secondary';
  destructive?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  size?: 'default' | 'small';
  onClick?: () => void;
}

const Button = (props: PropsWithChildren<IProps>) => {
  const {
    variant = 'primary',
    destructive = false,
    type = 'button',
    disabled = false,
    size = 'default',
    onClick,
    children,
  } = props;

  return (
    <button
      className={style.button}
      type={type === 'submit' ? 'submit' : 'button'}
      disabled={disabled}
      onClick={onClick}
      data-variant={variant}
      data-destructive={destructive}
      data-size={size}
    >
      {children}
    </button>
  );
};

export default Button;
