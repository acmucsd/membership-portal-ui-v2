import ItemCard from '@/components/store/ItemCard';
import { config } from '@/lib';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import NoImage from '@/public/assets/graphics/cat404.png';
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
      <div className={styles.slider}>
        {items.map(item => (
          <ItemCard
            className={styles.card}
            // TEMP. Also, the API sometimes returns null for item.picture.
            image={item.picture?.startsWith('https://acmucsd') ? item.picture : NoImage.src}
            title={item.itemName}
            href={`${config.itemRoute}${item.uuid}`}
            cost={item.options[0]?.price ?? 0}
            key={item.uuid}
          />
        ))}
      </div>
    </div>
  );
};

export default CollectionSlider;
