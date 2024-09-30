import Typography from '@/components/common/Typography';
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

/**
 * Equivalent to
 * {@link https://www.figma.com/design/YQjQ1ruLtMICqnzzxBXxOL/ACM-Portal---Onboarding-Screens?node-id=158-1208&t=GsDtnYW4YBMPSN8C-4|"Desktop and mobile buttons"}
 * in the Figma
 */
const Button = (props: PropsWithChildren<IProps>) => {
  const {
    variant = 'primary',
    destructive = false,
    submit,
    disabled = false,
    size = 'default',
    onClick,
    children,
    className = '',
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
      <Typography variant="h5/medium" component="span">
        {children}
      </Typography>
    </button>
  );
};

export default Button;
