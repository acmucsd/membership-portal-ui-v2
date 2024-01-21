import { Carousel } from '@/components/common';
import CreateButton from '@/components/store/CreateButton';
import EditButton from '@/components/store/EditButton';
import ItemCard from '@/components/store/ItemCard';
import { config } from '@/lib';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from './style.module.scss';

interface CollectionSliderProps {
  uuid: string;
  title: string;
  description: string;
  items: PublicMerchItem[];
  showEdit?: boolean;
}

const CollectionSlider = ({ uuid, title, description, items, showEdit }: CollectionSliderProps) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>
        {title}
        {showEdit && <EditButton type="collection" uuid={uuid} />}
      </h3>
      <p className={styles.description}>{description}</p>
      <Carousel>
        {items.map(item => (
          <ItemCard
            className={styles.card}
            image={getDefaultMerchItemPhoto(item)}
            title={item.itemName}
            href={`${config.store.itemRoute}${item.uuid}`}
            cost={item.options[0]?.price ?? 0}
            key={item.uuid}
          >
            {showEdit && <EditButton type="item" uuid={uuid} />}
          </ItemCard>
        ))}
        {showEdit && (
          <CreateButton className={styles.card} type="item" collection={uuid}>
            Add an item
          </CreateButton>
        )}
      </Carousel>
    </div>
  );
};

export default CollectionSlider;
