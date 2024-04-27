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
  inputHeight?: string;
}

type VerticalFormProps = FormItemProps & (InputTypeProps | SelectTypeProps);

const VerticalFormItem = (props: VerticalFormProps) => {
  const { icon, placeholder, formRegister, element, error, inputHeight } = props;

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

export default VerticalFormItem;
