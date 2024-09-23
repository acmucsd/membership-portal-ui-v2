import { OnboardingScreen } from '@/components/onboarding';
import { config } from '@/lib';
import { URL } from '@/lib/types';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

interface OnboardProps {
  destination: URL;
}

const OnboardPage: NextPage<OnboardProps> = ({ destination }) => {
  const router = useRouter();

  const handleExit = () => {
    router.push(destination);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 8.25rem)', display: 'flex', flexDirection: 'column' }}>
      <OnboardingScreen onDismiss={handleExit} onFinish={handleExit} />
    </div>
  );
};

export default OnboardPage;

export const getServerSideProps: GetServerSideProps<OnboardProps> = async ({ query }) => {
  const route = query?.destination ? decodeURIComponent(query?.destination as string) : null;

  return {
    props: {
      destination: route || config.homeRoute,
      quietNavbar: true,
    },
  };
};
