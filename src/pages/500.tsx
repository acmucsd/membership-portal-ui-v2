import { SignInButton } from '@/components/auth';
import { VerticalForm } from '@/components/common';
import Cat404 from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/404.module.scss';
import Image from 'next/image';

const InternalServerError = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 8.25rem)' }}>
      <VerticalForm style={{ alignItems: 'center', flex: 'auto', height: 'unset' }}>
        <h1 className={styles.header}>Something has gone terribly wrong</h1>
        <Image src={Cat404} width={256} height={256} alt="Sad Cat" />
        <span
          style={{
            textAlign: 'center',
          }}
        >
          Logging out will usually fix your issue.
        </span>
        <SignInButton type="link" display="button1" href="/logout" text="Logout" />
        <span
          style={{
            textAlign: 'center',
          }}
        >
          If that doesn&apos;t work, file a bug to us on our project issue&apos;s page&nbsp;
          <a
            href="https://github.com/acmucsd/membership-portal-ui-v2/issues/new"
            style={{
              color: 'var(--theme-primary-4)',
              textDecoration: 'underline',
              fontWeight: '700',
            }}
          >
            here
          </a>
          .
        </span>
      </VerticalForm>
    </div>
  );
};

export default InternalServerError;
