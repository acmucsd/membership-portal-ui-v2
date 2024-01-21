import { Carousel } from '@/components/common';
import CreateButton from '@/components/store/CreateButton';
import EditButton from '@/components/store/EditButton';
import HiddenIcon from '@/components/store/HiddenIcon';
import ItemCard from '@/components/store/ItemCard';
import { config } from '@/lib';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import Link from 'next/link';
import styles from './style.module.scss';

interface CollectionSliderProps {
  uuid: string;
  title: string;
  description: string;
  items: PublicMerchItem[];
  canManageStore?: boolean;
  previewPublic?: boolean;
  isHidden?: boolean;
}

const CollectionSlider = ({
  uuid,
  title,
  description,
  items,
  canManageStore,
  previewPublic,
  isHidden,
}: CollectionSliderProps) => {
  const preview = previewPublic ? '?preview=public' : '';

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        <Link href={`${config.store.collectionRoute}${uuid}`}>{title}</Link>
        {canManageStore && <EditButton type="collection" uuid={uuid} />}
        {isHidden && <HiddenIcon type="collection" />}
      </h3>
      <p className={styles.description}>{description}</p>
      <Carousel>
        {items
          .filter(item => canManageStore || !item.hidden)
          .map(item => (
            <ItemCard
              className={styles.card}
              image={getDefaultMerchItemPhoto(item)}
              title={item.itemName}
              href={`${config.store.itemRoute}${item.uuid}${preview}`}
              cost={item.options[0]?.price ?? 0}
              key={item.uuid}
            >
              {canManageStore && item.hidden && <HiddenIcon type="item" />}
              {canManageStore && <EditButton type="item" uuid={uuid} />}
            </ItemCard>
          ))}
        {canManageStore && (
          <CreateButton className={styles.card} type="item" collection={uuid}>
            Add an item
          </CreateButton>
        )}
      </Carousel>
    </div>
  );
};

export default CollectionSlider;
