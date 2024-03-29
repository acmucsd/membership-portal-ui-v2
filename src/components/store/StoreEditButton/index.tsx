import { EditButton } from '@/components/common';
import { config } from '@/lib';

interface StoreEditButtonProps {
  type: 'item' | 'collection';
  uuid: string;
}

const StoreEditButton = ({ type, uuid }: StoreEditButtonProps) => {
  return (
    <EditButton
      href={`${
        type === 'collection' ? config.store.collectionRoute : config.store.itemRoute
      }${uuid}/edit`}
      label={`Edit ${type}`}
    />
  );
};

export default StoreEditButton;
