import React, { HTMLInputTypeAttribute, ReactNode, useState } from 'react';
import { UseFormRegisterReturn, useForm } from 'react-hook-form';
import styles from './style.module.scss';

interface InputTypeProps {
  element: 'input';
  type: HTMLInputTypeAttribute;
}

interface SelectTypeProps {
  element: 'select';
  options: (number | string)[];
}
interface SelectMultipleTypeProps {
  element: 'select-multiple';
  options: string[];
}
interface FormItemProps {
  icon: ReactNode;
  name: string;
  placeholder: string;
  formRegister: UseFormRegisterReturn;
  error: any;
  inputHeight?: string;
}

type VerticalFormProps = FormItemProps &
  (InputTypeProps | SelectTypeProps | SelectMultipleTypeProps);

const VerticalFormItem = (props: VerticalFormProps) => {
  const { icon, placeholder, formRegister, element, error, inputHeight } = props;
  const { setValue } = useForm();
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
            <option value="" disabled selected>
              {placeholder}
            </option>
            {options.map(value => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <p className={styles.formError}>{error?.message}</p>
      </div>
    );
  }

  if (element === 'select-multiple') {
    // const { control, handleSubmit, setValue } = useForm();
    const { options } = props;
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
      setSelectedOptions(selectedValues);
      setValue('email', selectedValues, { shouldValidate: true });
    };
    const filteredOptions = options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className={styles.formItem}>
        <div className={styles.formInput}>
          <div className={styles.iconContainer}>{icon}</div>
          <div>
            <h1>Selected: {selectedOptions.join(', ')}</h1>
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.inputField}
              />
              <select
                className={styles.selectMultipleField}
                style={{
                  lineHeight: inputHeight,
                }}
                multiple
                // {...register('email', { required: 'At least one email must be selected' })}
                {...formRegister}
                onChange={handleSelectionChange}
                // {...formRegister}
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {filteredOptions.map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <p className={styles.formError}>{error?.message}</p>
      </div>
    );
  }
  // if (element === 'select-multiple') {
  //   const { options } = props;
  //   const [searchTerm, setSearchTerm] = useState('');
  //   const [filteredOptions, setFilteredOptions] = useState(options);

  //   useEffect(() => {
  //     setFilteredOptions(options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase())));
  //   }, [searchTerm, options]);

  //   const handleSelectionChange = (event, field) => {
  //     const selectedValues = Array.from(event.target.selectedOptions, option => option.value);
  //     setValue()
  //   }
  // }
  return null;
};

export default VerticalFormItem;
