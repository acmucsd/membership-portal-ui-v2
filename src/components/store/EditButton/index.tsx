import { config } from '@/lib';
import EditIcon from '@/public/assets/icons/edit.svg';
import Link from 'next/link';
import styles from './style.module.scss';

interface EditButtonProps {
  type: 'item' | 'collection';
  uuid: string;
}

const EditButton = ({ type, uuid }: EditButtonProps) => {
  const label = `Edit ${type}`;
  return (
    <Link
      className={styles.edit}
      href={`${
        type === 'collection' ? config.store.collectionRoute : config.store.itemRoute
      }${uuid}/edit`}
      title={label}
    >
      <EditIcon className={styles.icon} aria-label={label} />
    </Link>
  );
};

export default EditButton;
