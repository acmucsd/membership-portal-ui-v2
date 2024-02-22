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

  let disableReason = '';
  if (lifetimeRemaining === 0) {
    disableReason = 'You have reached your lifetime limit on this item.';
  } else if (monthlyRemaining === 0) {
    disableReason = 'You have reached your limit on this item. Come back next month!';
  } else if (!inStock) {
    disableReason = `This ${
      optionsKey?.toLocaleLowerCase() ?? 'option'
    } is currently out of stock.`;
  } else {
    disableReason = `You can buy up to ${maxCanBuy} of this item.`;
  }

  return (
    <div className={styles.addCartGroup}>
      {/* TEMP until Add to Cart is functional */}
      <p>In cart: {String(inCart)}</p>

      <Typography variant="h5/regular">{disableReason}</Typography>
      {noOptionSelected ? (
        <Typography variant="h5/regular" className={styles.error}>
          Please select a ${optionsKey?.toLocaleLowerCase() ?? 'option'}.
        </Typography>
      ) : null}

      {noOptionSelected ? null : (
        <form
          className={styles.buttonRow}
          onSubmit={e => {
            onCartChange(!inCart);
            e.preventDefault();
          }}
        >
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
            type="submit"
            disabled={!isPurchasable}
          >
            Add to Cart
          </button>
        </form>
      )}
    </div>
  );
};
export default CartOptionsGroup;
