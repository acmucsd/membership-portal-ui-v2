import { Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import StoreModal from '@/components/store/StoreModal';
import { config, cssVars } from '@/lib';
import { UUID } from '@/lib/types';
import { ClientCartItem } from '@/lib/types/client';
import { toSentenceCase } from '@/lib/utils';
import utilStyles from '@/styles/utils.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import styles from './style.module.scss';

interface CartItemCardProps {
  item: ClientCartItem;
  removeItem?: (optionUUID: UUID) => void;
  removable: boolean;
}

const CartItemCard = ({ item, removeItem, removable }: CartItemCardProps) => {
  const itemPage = `${config.itemRoute}${item.uuid}`;

  // in a useMemo because its position changes in mobile
  const removeButton = useMemo(
    () =>
      removable && (
        <StoreModal
          opener={
            <button type="button" className={styles.removeBtn}>
              <Typography variant="h5/regular" component="span">
                Remove Item
              </Typography>
            </button>
          }
          title="Are you sure you want to remove this item?"
          onConfirm={() => {
            setTimeout(() => removeItem && removeItem(item.option.uuid), 100);
          }}
        >
          <CartItemCard item={item} removable={false} />
        </StoreModal>
      ),
    [removable, item, removeItem]
  );

  return (
    <div className={styles.cartItem}>
      {item.merchPhotos?.[0] && (
        <div className={styles.leftCol}>
          <Link href={itemPage}>
            <div className={styles.imageWrapper}>
              <Image
                src={item.merchPhotos[0].uploadedPhoto}
                alt={item.itemName}
                sizes={`(max-width: ${cssVars['breakpoint-md']}) 100px, 150px`}
                fill
              />
            </div>
          </Link>
          <div className={utilStyles.shownMobile}>{removeButton}</div>
        </div>
      )}
      <div className={styles.rightCol}>
        <div className={styles.cartItemInfo}>
          <div className={styles.title}>
            <Link href={itemPage}>
              <Typography variant="h4/medium" component="h3">
                {item.itemName}
              </Typography>
            </Link>
            <Diamonds count={item.option?.price ?? 0} className={styles.price} />
          </div>

          {item.option.metadata && (
            <Typography variant="h5/bold" component="p">
              {toSentenceCase(item.option.metadata?.type)}&nbsp;
              <Typography variant="h5/regular" component="span">
                {item.option.metadata?.value}
              </Typography>
            </Typography>
          )}
          <Typography variant="h5/bold" component="p">
            Quantity:&nbsp;
            <Typography variant="h5/regular" component="span">
              {item.quantity}
            </Typography>
          </Typography>
        </div>
        <div className={utilStyles.shownDesktop}>{removeButton}</div>
      </div>
    </div>
  );
};

export default CartItemCard;
