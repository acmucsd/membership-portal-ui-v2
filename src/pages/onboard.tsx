import { OnboardingScreen } from '@/components/onboarding';
import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { URL } from '@/lib/types';
import { PrivateProfile } from '@/lib/types/apiResponses';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

interface OnboardProps {
  destination: URL;
  authToken: string;
  user: PrivateProfile;
}

const OnboardPage: NextPage<OnboardProps> = ({ authToken, user, destination }) => {
  const router = useRouter();

  const handleExit = () => {
    router.push(destination);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 8.25rem)', display: 'flex', flexDirection: 'column' }}>
      <OnboardingScreen
        user={user}
        onDismiss={handleExit}
        onFinish={() => {
          UserAPI.updateCurrentUserProfile(authToken, { onboardingSeen: true });
        }}
      />
    </div>
  );
};

export default OnboardPage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth = async ({ query, authToken }) => {
  const route = query?.destination ? decodeURIComponent(query?.destination as string) : null;

  return {
    props: {
      destination: route || config.homeRoute,
      authToken,
      quietNavbar: true,
    },
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
