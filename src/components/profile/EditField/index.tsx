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
  changed?: boolean;
  value: string;
  onChange: (value: string) => void;
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
  changed,
  value,
  onChange,
  onBlur,
}: EditFieldProps) => {
  return (
    <EditBlock icon={icon} title={label} wrapper="label">
      <div
        className={`${styles.fieldBorder} ${changed ? styles.unsaved : ''} ${
          disabled ? styles.disabled : ''
        }`}
      >
        {prefix ? <span className={styles.prefix}>{prefix}</span> : null}
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
      {description || maxLength ? (
        <div className={styles.info}>
          {description ? <p className={styles.description}>{description}</p> : null}
          {maxLength ? (
            <span className={styles.chars}>
              {value.length}/{maxLength}
            </span>
          ) : null}
        </div>
      ) : null}
    </EditBlock>
  );
};

interface SingleFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  changed?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export const SingleField = ({
  label,
  placeholder,
  type,
  changed,
  value,
  onChange,
}: SingleFieldProps) => {
  return (
    <label className={styles.singleField}>
      <h4 className={styles.singleLabel}>{label}</h4>
      <div className={`${styles.fieldBorder} ${changed ? styles.unsaved : ''}`}>
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
