import ContentView from '@/components/layout/ContentView';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';

import { PrivateProfile } from '@/lib/types/apiResponses';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface LayoutProps {
  user: PrivateProfile;
}

const PageLayout = ({ user, children }: PropsWithChildren<LayoutProps>) => (
  <>
    <PageHeader />
    <main className={user ? styles.twoColumn : styles.oneColumn}>
      {user ? <Navbar /> : null}
      <ContentView>{children}</ContentView>
    </main>
  </>
);

export default PageLayout;
