import { PropsWithChildren } from 'react';
import style from './style.module.scss';

interface IProps {
  variant?: 'primary' | 'secondary';
  destructive?: boolean;
  submit?: boolean;
  disabled?: boolean;
  size?: 'default' | 'small';
  onClick?: () => void;
  className?: string;
}

const Button = (props: PropsWithChildren<IProps>) => {
  const {
    variant = 'primary',
    destructive = false,
    submit,
    disabled = false,
    size = 'default',
    onClick,
    children,
    className,
  } = props;

  return (
    <button
      className={`${style.button} ${className}`}
      type={submit ? 'submit' : 'button'}
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
