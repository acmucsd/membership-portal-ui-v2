import { Typography } from '@/components/common';
import styles from './style.module.scss';

interface CartOptionGroupProps {
  currOption: string | undefined;
  inCart: boolean;
  lifetimeRemaining: number;
  monthlyRemaining: number;
  available: number;
  amountToBuy: string;
  optionsKey?: string;
  onCartChange: (inCart: boolean) => void;
  onAmountChange: (amountToBuy: string) => void;
}

const CartOptionsGroup = ({
  currOption,
  inCart,
  onCartChange,
  lifetimeRemaining,
  monthlyRemaining,
  available,
  amountToBuy,
  optionsKey,
  onAmountChange,
}: CartOptionGroupProps) => {
  const maxCanBuy = Math.min(lifetimeRemaining, monthlyRemaining, available);

  const inStock = available > 0;
  const isPurchasable = inStock && maxCanBuy > 0;
  const noOptionSelected = currOption === undefined && optionsKey !== undefined;

  let buyButtonText = 'Add to Cart';

  if (maxCanBuy === 0) {
    buyButtonText = 'Limit Reached';
  } else if (currOption === undefined && optionsKey !== undefined) {
    buyButtonText = `Select a ${optionsKey}`;
  } else if (inStock) {
    buyButtonText = 'Add to Cart';
  } else {
    buyButtonText = 'Out of Stock';
  }

  return (
    <div className={styles.addCartGroup}>
      <p>In cart: {String(inCart)}</p>

      {maxCanBuy > 0 ? (
        <Typography variant="h5/regular">You can buy up to {maxCanBuy} of this item.</Typography>
      ) : (
        <Typography variant="h5/regular">You can&rsquo;t buy any more of this item!.</Typography>
      )}
      {noOptionSelected ? (
        <Typography variant="h5/regular" className={styles.error}>
          {`Please select a ${optionsKey?.toLocaleLowerCase() ?? 'option'}`}.
        </Typography>
      ) : null}

      {noOptionSelected ? null : (
        <div className={styles.buttonRow}>
          {!isPurchasable || maxCanBuy <= 1 ? null : (
            <label className={styles.quantityColumn}>
              <Typography variant="h4/bold">Quantity</Typography>
              <input
                type="number"
                className={styles.quantity}
                min={1}
                max={maxCanBuy}
                value={amountToBuy}
                onChange={e => onAmountChange(e.currentTarget.value)}
              />
            </label>
          )}

          <button
            className={`${isPurchasable ? styles.buttonInStock : styles.buttonNoStock} ${
              styles.button
            }`}
            type="button"
            onClick={() => onCartChange(!inCart)}
            disabled={!isPurchasable}
          >
            {buyButtonText}
          </button>
        </div>
      )}
    </div>
  );
};
export default CartOptionsGroup;
