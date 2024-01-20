import { Carousel } from '@/components/common';
import ItemCard from '@/components/store/ItemCard';
import { config } from '@/lib';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import { getDefaultMerchItemPhoto } from '@/lib/utils';
import styles from './style.module.scss';

interface CollectionSliderProps {
  title: string;
  description: string;
  items: PublicMerchItem[];
}

const CollectionSlider = ({ title, description, items }: CollectionSliderProps) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <Carousel>
        {items.map(item => (
          <ItemCard
            className={styles.card}
            image={getDefaultMerchItemPhoto(item)}
            title={item.itemName}
            href={`${config.itemRoute}${item.uuid}`}
            cost={item.options[0]?.price ?? 0}
            key={item.uuid}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CollectionSlider;
