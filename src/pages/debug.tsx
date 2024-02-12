import { Button, Typography } from '@/components/common';
import { config, showToast } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { setClientCookie } from '@/lib/services/CookieService';
import { CookieCartItem } from '@/lib/types/client';
import { CookieType } from '@/lib/types/enums';
import { GetServerSideProps } from 'next';

const DebugPage = () => {
  return (
    <div>
      <Typography variant="h1/bold">Debug</Typography>
      <hr style={{ border: '1px solid #000' }} />
      <Typography variant="h2/medium">Store</Typography>
      <Button
        onClick={() => {
          const newCart: CookieCartItem[] = [
            {
              itemUUID: 'af106068-2f3b-4bcd-81a5-229ecef99cdc',
              optionUUID: '7e8f682f-9fe1-4837-b1d4-5576a41fe55a',
              quantity: 2,
            },
            {
              itemUUID: 'afe7cfff-9a62-4146-8c8c-5b14f39ba0a0',
              optionUUID: '72d22f34-c366-4ecd-a365-059661a0f0fc',
              quantity: 1,
            },
            {
              itemUUID: '2a37de8e-7b5c-41ba-84bc-f7f40804be85',
              optionUUID: 'e3e68f83-d97e-40b0-a5ea-2c169a434403',
              quantity: 10,
            },
            {
              itemUUID: '0623148a-9477-4098-87f6-6ee1f7b1a4a6',
              optionUUID: '5454b55a-d4e8-443f-9664-131395430b79',
              quantity: 1,
            },
          ];
          setClientCookie(CookieType.CART, JSON.stringify(newCart));
          showToast('Filled your cart, buddy-o!', 'Refresh to apply changes');
        }}
      >
        Fill Cart
      </Button>
    </div>
  );
};

export default DebugPage;

const getServerSidePropsFunc: GetServerSideProps = async () => {
  if (!config.isDevelopment)
    return {
      notFound: true,
    };

  return { props: {} };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
