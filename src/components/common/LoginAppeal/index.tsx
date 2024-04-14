import Login from '@/components/common/Login';
import Typography from '@/components/common/Typography';
import { config } from '@/lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import styles from './style.module.scss';

interface LoginAppealProps {
  children: ReactNode;
}

const LoginAppeal = ({ children }: LoginAppealProps) => {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.aside}>
        <Typography variant="h1/bold" component="h2">
          Join ACM
        </Typography>
        <Typography variant="body/medium" component="p" style={{ lineHeight: '1.5' }}>
          {children}
        </Typography>
      </div>
      <div className={styles.line} />
      <div className={styles.login}>
        <Login destination={router.asPath} />
        <p>
          Don&lsquo;t have an account?{' '}
          <Link href={config.registerRoute} className={styles.signUp}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginAppeal;
