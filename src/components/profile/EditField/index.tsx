import React from 'react';
import styles from './style.module.scss';

interface EditBlockProps {
  icon?: React.ReactNode;
  title: string;
  wrapper?: 'label' | 'div';
  children?: React.ReactNode;
}

export const EditBlock = ({ icon, title, wrapper: Wrapper = 'div', children }: EditBlockProps) => {
  return (
    <Wrapper className={`${styles.field} ${icon ? styles.hasIcon : ''}`}>
      <h3 className={styles.label}>
        {icon} {title}
      </h3>
      <div className={styles.content}>{children}</div>
    </Wrapper>
  );
};

interface EditFieldProps {
  icon?: React.ReactNode;
  label: string;
  name?: string;
  placeholder?: string;
  description?: string;
  prefix?: string;
  type?: string;
  element?: 'input' | 'textarea' | 'select';
  options?: string[];
  maxLength?: number;
  disabled?: boolean;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onBlur?: (value: string) => string;
}

export const EditField = ({
  icon,
  label,
  name,
  placeholder,
  description,
  prefix,
  maxLength,
  type = 'text',
  element: Input = 'input',
  options,
  disabled,
  value,
  onChange,
  onBlur,
}: EditFieldProps) => {
  return (
    <EditBlock icon={icon} title={label} wrapper="label">
      <div className={`${styles.fieldBorder} ${disabled ? styles.disabled : ''}`}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <Input
          className={styles.field}
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
          onBlur={() => {
            if (onBlur) {
              const newValue = onBlur(value);
              if (value !== newValue) {
                onChange(newValue);
              }
            }
          }}
        >
          {options?.map(option => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </Input>
      </div>
      {(description || maxLength) && (
        <div className={styles.info}>
          {description && <p className={styles.description}>{description}</p>}
          {maxLength && (
            <span className={styles.chars}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </EditBlock>
  );
};

interface SingleFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

export const SingleField = ({ label, placeholder, type, value, onChange }: SingleFieldProps) => {
  return (
    <label className={styles.singleField}>
      <h4 className={styles.singleLabel}>{label}</h4>
      <div className={styles.fieldBorder}>
        <input
          className={styles.field}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
        />
      </div>
    </label>
  );
};
