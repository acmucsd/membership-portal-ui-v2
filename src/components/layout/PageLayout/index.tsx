import Navbar from '@/components/layout/Navbar';
import { UserAccessType } from '@/lib/types/enums';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface LayoutProps {
  accessType?: UserAccessType;
}

const PageLayout = ({ accessType, children }: PropsWithChildren<LayoutProps>) => (
  <>
    <Navbar accessType={accessType} />
    <main className={styles.content}>{children}</main>
  </>
);

export default PageLayout;
