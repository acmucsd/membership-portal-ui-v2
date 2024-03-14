import { HTMLInputTypeAttribute, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './style.module.scss';

interface InputTypeProps {
  element: 'input';
  type: HTMLInputTypeAttribute;
  placeholder: string;
}

interface SelectTypeProps {
  element: 'select';
  options: (number | string)[];
}
interface FormItemProps {
  icon: ReactNode;
  name: string;
  formRegister: UseFormRegisterReturn;
  error: any;
  inputHeight?: string;
}

type SignInFormProps = FormItemProps & (InputTypeProps | SelectTypeProps);

const SignInFormItem = (props: SignInFormProps) => {
  const { icon, formRegister, element, error, inputHeight } = props;

  if (element === 'input') {
    const { type, placeholder } = props;
    return (
      <div className={styles.formItem}>
        <div className={styles.formInput}>
          <div className={styles.iconContainer}>{icon}</div>
          <input
            className={styles.inputField}
            required
            type={type}
            placeholder={placeholder}
            style={{
              lineHeight: inputHeight,
            }}
            {...formRegister}
          />
        </div>
        <p className={styles.formError}>{error?.message}</p>
      </div>
    );
  }

  if (element === 'select') {
    const { options } = props;

    return (
      <div className={styles.formItem}>
        <div className={styles.formInput}>
          <div className={styles.iconContainer}>{icon}</div>
          <select
            {...formRegister}
            className={styles.selectField}
            style={{
              lineHeight: inputHeight,
            }}
          >
            {options.map(value => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <p className={styles.formError}>{error?.message}</p>
      </div>
    );
  }

  return null;
};

export default SignInFormItem;
