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
              itemUUID: '17774f20-e04d-4ace-a6fc-8dfe9286eca7',
              optionUUID: 'd75f35b3-e452-46ea-a58b-2a2e010e6ff9',
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
