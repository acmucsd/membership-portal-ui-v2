import { SignInButton } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import { AuthAPI } from '@/lib/api';
import styles from '@/styles/pages/verify-email.module.scss';
import { GetServerSideProps } from 'next';

interface VerifyPageProps {
  status: boolean;
}

const VerifyEmail = ({ status }: VerifyPageProps) => {
  if (status) {
    return (
      <VerticalForm
        style={{
          alignItems: 'center',
          width: '50%',
          gap: '2rem',
        }}
      >
        <h1 className={styles.header}>Success! Your account has been verified.</h1>
        <SignInButton
          type="link"
          href="/login"
          display="button1"
          text="Return to Login"
          style={{
            width: 'fit-content',
            padding: '0 2rem',
          }}
        />
      </VerticalForm>
    );
  }
  return (
    <VerticalForm
      style={{
        alignItems: 'center',
        width: '50%',
        gap: '2rem',
      }}
    >
      <h1 className={styles.header}>Unable to verify your email! Please try again.</h1>
      <SignInButton
        type="link"
        href="/login"
        display="button1"
        text="Return to Login"
        style={{
          width: 'fit-content',
          padding: '0 2rem',
        }}
      />
    </VerticalForm>
  );
};

export default VerifyEmail;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const code = params?.accessCode as string;

  try {
    await AuthAPI.verifyEmail(code);

    return {
      props: {
        title: 'Email Verification',
        status: true,
      },
    };
  } catch (err: any) {
    return {
      props: {
        title: 'Email Verification',
        status: false,
      },
    };
  }
};
