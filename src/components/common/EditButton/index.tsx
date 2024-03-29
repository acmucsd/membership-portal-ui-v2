import EditIcon from '@/public/assets/icons/edit.svg';
import Link from 'next/link';
import styles from './style.module.scss';

interface EditButtonProps {
  href: string;
  label: string;
}

const EditButton = ({ href, label }: EditButtonProps) => {
  return (
    <Link className={styles.edit} href={href} title={label}>
      <EditIcon className={styles.icon} aria-label={label} />
    </Link>
  );
};

export default EditButton;
