import styles from './style.module.scss';

interface SignInTitleProps {
  text: string;
  description?: string;
}

const SignInTitle = ({ text, description }: SignInTitleProps) => {
  return (
    <>
      <h1 className={styles.title}>{text}</h1>
      {description ? <h2 className={styles.subtitle}>{description}</h2> : null}
    </>
  );
};

export default SignInTitle;
