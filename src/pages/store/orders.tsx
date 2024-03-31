import { Dropdown, Typography } from '@/components/common';
import { Navbar, OrdersDisplay } from '@/components/store';
import { StoreAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile, PublicOrder, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/StoreOrders.module.scss';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

interface OrderPageProps {
  user: PrivateProfile;
  orders: PublicOrder[];
  futurePickupEvents: PublicOrderPickupEvent[];
}

const orderInFilter = (order: PublicOrder, filter: string): boolean => {
  const lastDay = new Date();
  if (filter === 'all-time') {
    return true;
  }
  if (filter === 'past-30-days') {
    lastDay.setDate(lastDay.getDate() - 30);
  } else if (filter === 'past-3-months') {
    lastDay.setMonth(lastDay.getMonth() - 3);
  } else if (filter === 'past-6-months') {
    lastDay.setMonth(lastDay.getMonth() - 6);
  } else if (filter === 'past-year') {
    lastDay.setFullYear(lastDay.getFullYear() - 1);
  }
  return new Date(order.orderedAt) >= lastDay;
};

const StoreOrderPage = ({ user: { credits }, orders, futurePickupEvents }: OrderPageProps) => {
  const [filter, setFilter] = useState('past-6-months');

  const filteredOrders = orders.filter(o => orderInFilter(o, filter));

  return (
    <div className={styles.page}>
      <Navbar balance={credits} showBack />
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h1/bold">My Orders</Typography>
          <div className={styles.filter}>
            <Typography variant="h3/regular">Orders placed</Typography>
            <Dropdown
              name="timeOptions"
              ariaLabel="Filter store orders by time"
              options={[
                { value: 'past-30-days', label: 'in the past 30 days' },
                { value: 'past-3-months', label: 'in the past 3 months' },
                { value: 'past-6-months', label: 'in the past 6 months' },
                { value: 'past-year', label: 'in the past year' },
                { value: 'all-time', label: 'since the dawn of time' },
              ]}
              value={filter}
              onChange={v => setFilter(v)}
            />
          </div>
        </div>
        <OrdersDisplay orders={filteredOrders} futurePickupEvents={futurePickupEvents} />
      </div>
    </div>
  );
};

export default StoreOrderPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  const ordersPromise = StoreAPI.getAllOrders(AUTH_TOKEN);
  const futurePickupEventsPromise = StoreAPI.getFutureOrderPickupEvents(AUTH_TOKEN);

  const [orders, futurePickupEvents] = await Promise.all([
    ordersPromise,
    futurePickupEventsPromise,
  ]);

  orders.sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());

  return { props: { title: 'My Orders', orders, futurePickupEvents } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
