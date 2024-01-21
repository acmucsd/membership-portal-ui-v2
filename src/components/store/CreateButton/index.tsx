import { config } from '@/lib';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { BsPlus } from 'react-icons/bs';
import styles from './style.module.scss';

interface CreateButtonProps {
  className?: string;
  type: 'item' | 'collection';
  collection?: string;
}

const CreateButton = ({
  className,
  type,
  collection,
  children,
}: PropsWithChildren<CreateButtonProps>) => {
  return (
    <Link
      href={`${type === 'collection' ? config.store.collectionRoute : config.store.itemRoute}new${
        collection ? `?collection=${collection}` : ''
      }`}
      className={`${className} ${styles.itemCard}`}
    >
      <BsPlus className={styles.icon} aria-hidden />
      {children}
    </Link>
  );
};

export default CreateButton;
