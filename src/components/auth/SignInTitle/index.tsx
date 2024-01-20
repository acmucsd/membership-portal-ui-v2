import styles from './style.module.scss';

interface SignInTitleProps {
  text: string;
}

const SignInTitle = ({ text }: SignInTitleProps) => {
  return <h1 className={styles.title}>{text}</h1>;
};

export default SignInTitle;
