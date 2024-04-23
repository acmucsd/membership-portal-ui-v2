import { VerticalForm, VerticalFormButton } from '@/components/common';
import styles from '@/styles/pages/check-email.module.scss';
import type { GetServerSideProps } from 'next';

interface CheckEmailProps {
  email: string;
}

const CheckEmail = ({ email }: CheckEmailProps) => {
  return (
    <VerticalForm
      style={{
        alignItems: 'center',
        width: '75%',
        gap: '1.5rem',
      }}
    >
      <h1 className={styles.header}>Verify your email address</h1>
      <span className={styles.body}>
        We&apos;ve sent an email to <b>{email}</b> to verify your email address and activate your
        account.
      </span>
      <VerticalFormButton
        type="link"
        display="button1"
        href="/login"
        text="Return to login"
        style={{
          width: 'fit-content',
          padding: '0 2rem',
        }}
      />
    </VerticalForm>
  );
};

export default CheckEmail;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { email } = query;

  if (!email) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: { title: 'Verify your email address', email },
  };
};
