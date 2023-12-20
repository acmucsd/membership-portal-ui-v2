import { Navbar } from '@/components/store';
import AddCartButton from '@/components/store/AddCartButton';
import SizeSelector from '@/components/store/SizeSelector';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

interface ItemPageProps {
  user: PrivateProfile;
}
const StoreItemPage = ({ user: { credits } }: ItemPageProps) => {
  const [size, setSize] = useState<'S' | 'M' | 'L' | 'XL'>();
  const [inCart, setInCart] = useState<boolean>(false);
  const [inStock, setInStock] = useState<boolean>(false);

  return (
    <>
      <Navbar balance={credits} showBack />
      <h1>Store Item Page {size}</h1>
      <SizeSelector currSize={size} setSize={setSize} />
      <AddCartButton inCart={inCart} setInCart={setInCart} currSize={size} inStock={inStock} />
    </>
  );
};

export default StoreItemPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);

// Knowledge:
// useState typing: https://stackoverflow.com/questions/72016031/how-to-set-type-of-variable-on-usestate-using-typescript#:~:text=You%20just%20need%20to%20specify%20the%20type%20of,const%20%5B%20text%2C%20setText%20%5D%20%3D%20useState%20%28%27%27%29%3B
// State Sharing: https://react.dev/learn/sharing-state-between-components
