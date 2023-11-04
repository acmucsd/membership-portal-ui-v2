import styles from './style.module.scss';

interface EditFieldProps {
  label: string;
  placeholder: string;
  description?: string;
  prefix?: string;
  type?: string;
  element?: 'input' | 'textarea';
  maxLength?: number;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
}

const EditField = ({
  label,
  placeholder,
  description,
  prefix,
  maxLength,
  type = 'text',
  element: Input = 'input',
  value,
  onChange,
}: EditFieldProps) => {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.content}>
        <div className={styles.fieldBorder}>
          {prefix && <span className={styles.prefix}>{prefix}</span>}
          <Input
            className={styles.field}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
          />
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
      </div>
    </label>
  );
};

export default EditField;
