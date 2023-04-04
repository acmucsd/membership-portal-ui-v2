import { HTMLInputTypeAttribute, ReactNode } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './style.module.scss';

interface InputTypeProps {
  element: 'input';
  type: HTMLInputTypeAttribute;
}

interface SelectTypeProps {
  element: 'select';
  options: (number | string)[];
}
interface FormItemProps {
  icon: ReactNode;
  name: string;
  placeholder: string;
  formRegister: UseFormRegisterReturn;
  error: any;
}

type SignInFormProps = FormItemProps & (InputTypeProps | SelectTypeProps);

const SignInFormItem = (props: SignInFormProps) => {
  const { icon, placeholder, formRegister, element, error } = props;

  if (element === 'input') {
    const { type } = props;
    return (
      <div className={styles.formItem}>
        <div className={styles.formInput}>
          <div className={styles.iconContainer}>{icon}</div>
          <input
            className={styles.inputField}
            required
            type={type}
            placeholder={placeholder}
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
          <select {...formRegister} className={styles.selectField}>
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
