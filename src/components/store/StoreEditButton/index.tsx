import { EditButton } from '@/components/common';
import { config } from '@/lib';

interface StoreEditButtonProps {
  type: 'item' | 'collection';
  uuid: string;
}

const StoreEditButton = ({ type, uuid }: StoreEditButtonProps) => {
  const label = `Edit ${type}`;
  return (
    <EditButton
      href={`${
        type === 'collection' ? config.store.collectionRoute : config.store.itemRoute
      }${uuid}/edit`}
      label={label}
    />
  );
};

export default StoreEditButton;
