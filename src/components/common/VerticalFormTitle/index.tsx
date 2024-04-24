import styles from './style.module.scss';

interface VerticalFormTitleProps {
  text: string;
  description?: string;
}

const VerticalFormTitle = ({ text, description }: VerticalFormTitleProps) => {
  return (
    <>
      <h1 className={styles.title}>{text}</h1>
      {description ? <h2 className={styles.subtitle}>{description}</h2> : null}
    </>
  );
};

export default VerticalFormTitle;
