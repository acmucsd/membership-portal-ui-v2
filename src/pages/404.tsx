import { VerticalForm, VerticalFormButton } from '@/components/common';
import Cat404 from '@/public/assets/graphics/cat404.png';
import styles from '@/styles/pages/404.module.scss';
import Image from 'next/image';

const PageNotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 8.25rem)' }}>
      <VerticalForm style={{ alignItems: 'center', flex: 'auto', height: 'unset' }}>
        <h1 className={styles.header}>Whoops, we ended up on the wrong page!</h1>
        <Image src={Cat404} width={256} height={256} alt="Sad Cat" />
        <VerticalFormButton type="link" display="button1" href="/" text="Return to Home" />
      </VerticalForm>
    </div>
  );
};

export default PageNotFound;
