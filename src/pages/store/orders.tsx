import { Typography } from '@/components/common';
import { Navbar } from '@/components/store';
import OrdersDisplay from '@/components/store/OrdersDisplay';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicOrder } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/store/orders/index.module.scss';
import { GetServerSideProps } from 'next';

interface OrderPageProps {
  user: PrivateProfile;
  orders: PublicOrder[];
}

const StoreOrderPage = ({ user: { credits }, orders }: OrderPageProps) => {
  return (
    <div className={styles.page}>
      <Navbar balance={credits} showBack />
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h1/bold">My Orders</Typography>
          <Typography variant="body/large">Orders placed in last 6 months</Typography>
        </div>
        <OrdersDisplay orders={orders} />
      </div>
    </div>
  );
};

export default StoreOrderPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const orders = await StoreAPI.getAllOrders(AUTH_TOKEN);

  return { props: { orders } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
