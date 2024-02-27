import { Typography } from '@/components/common';
import Diamonds from '@/components/store/Diamonds';
import StoreConfirmModal from '@/components/store/StoreConfirmModal';
import { config } from '@/lib';
import type { UUID } from '@/lib/types';
import { ClientCartItem } from '@/lib/types/client';
import { capitalize, getDefaultMerchItemPhoto, validateClientCartItem } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import styles from './style.module.scss';

interface CartItemCardProps {
  item: ClientCartItem;
  removeItem?: (optionUUID: UUID) => void;
  removable: boolean;
}

/**
 * Card for items displayed on cart page
 */
const CartItemCard = ({ item, removeItem, removable }: CartItemCardProps) => {
  const itemPage = `${config.store.itemRoute}${item.uuid}`;

  const unavailableReason = validateClientCartItem(item);

  const remover = removable && (
    <StoreConfirmModal
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
    </StoreConfirmModal>
  );

  return (
    <div className={styles.cartItem}>
      <div className={styles.leftCol}>
        <Link href={itemPage}>
          <div className={styles.imageWrapper}>
            <Image
              src={getDefaultMerchItemPhoto(item)}
              alt={item.itemName}
              sizes={`(max-width: ${config.cssVars.breakpointMd}) 100px, 150px`}
              fill
            />
          </div>
        </Link>
      </div>
      <div className={styles.rightCol}>
        <div className={styles.cartItemInfo}>
          <div className={styles.title}>
            <Link href={itemPage}>
              <Typography variant="h4/medium" component="h3">
                {item.itemName}
              </Typography>
            </Link>
            <Diamonds count={item.option.price * item.quantity ?? 0} className={styles.price} />
          </div>

          {item.option.metadata && (
            <Typography variant="h5/bold" component="p">
              {capitalize(item.option.metadata?.type)}:&nbsp;
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
      </div>
      {remover}
      {unavailableReason && removable && (
        <div className={styles.unavailable}>
          <div>
            <Typography variant="h3/medium" component="span">
              {unavailableReason}
            </Typography>
            {remover}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItemCard;
