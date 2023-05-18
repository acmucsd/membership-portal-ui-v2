import { PropsWithChildren } from 'react';
import style from './style.module.scss';

// TODO: Implement generic buttons that follow our design system
interface IProps {
  variant?: 'primary' | 'secondary';
  destructive?: boolean;
  disabled?: boolean;
  size?: 'default' | 'small';
  onClick: () => void;
}

const Button = (props: PropsWithChildren<IProps>) => {
  const {
    variant = 'primary',
    destructive = false,
    disabled = false,
    size = 'default',
    onClick,
    children,
  } = props;

  return (
    <button
      className={style.button}
      type="button"
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
