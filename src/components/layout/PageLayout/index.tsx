import Navbar from '@/components/layout/Navbar';
import { UserAccessType } from '@/lib/types/enums';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface LayoutProps {
  accessType?: UserAccessType;
  quietNavbar?: boolean;
}

const PageLayout = ({ accessType, quietNavbar, children }: PropsWithChildren<LayoutProps>) => (
  <>
    <Navbar accessType={accessType} quiet={quietNavbar} />
    <main className={styles.content}>{children}</main>
  </>
);

export default PageLayout;
