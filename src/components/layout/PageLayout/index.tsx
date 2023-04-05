import ContentView from '@/components/layout/ContentView';
import PageHeader from '@/components/layout/Navbar';

import { PrivateProfile } from '@/lib/types/apiResponses';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface LayoutProps {
  user: PrivateProfile;
}

const PageLayout = ({ user, children }: PropsWithChildren<LayoutProps>) => (
  <>
    <PageHeader user={user} />
    <main className={styles.oneColumn}>
      <ContentView>{children}</ContentView>
    </main>
  </>
);

export default PageLayout;
