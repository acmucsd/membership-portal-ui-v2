import { Dropdown } from '@/components/common';
import { useId } from 'react';
import styles from './style.module.scss';

interface AddCartButtonProps {
  currSize: string | undefined;
  inStock: boolean;
  inCart: boolean;
  lifetimeRemaining: number;
  monthlyRemaining: number;
  amountToBuy: number;
  onCartChange: (inCart: boolean) => void;
  onAmountChange: (amountToBuy: number) => void;
}

const AddCartButton = ({
  currSize,
  inStock,
  inCart,
  onCartChange,
  lifetimeRemaining,
  monthlyRemaining,
  amountToBuy,
  onAmountChange,
}: AddCartButtonProps) => {
  const myID = useId();

  const maxCanBuy = Math.min(lifetimeRemaining, monthlyRemaining);

  const validText = inStock ? (
    <p className={styles.valid}>This item is in stock.</p>
  ) : (
    <p className={styles.error}>This item is out of stock.</p>
  );

  let buyButtonText = 'Add to Cart';

  if (inCart) {
    buyButtonText = 'Remove from Cart';
  } else if (maxCanBuy === 0) {
    buyButtonText = 'Limit Reached';
  } else if (currSize === undefined) {
    buyButtonText = 'Select a Size';
  } else if (inStock) {
    buyButtonText = 'Add to Cart';
  } else {
    buyButtonText = 'Out of Stock';
  }

  const optionArr: Array<{ value: string; label: string } | '---'> = [];

  if (maxCanBuy === 0) {
    optionArr.push({ value: `0`, label: `0` });
  }

  for (let i = 1; i <= maxCanBuy; i += 1) {
    optionArr.push({ value: `${i}`, label: `${i}` });
  }

  optionArr.push('---');

  return (
    <div className={styles.addCartGroup}>
      {maxCanBuy > 0 ? (
        <p>You can buy up to {maxCanBuy} of this item.</p>
      ) : (
        <p>You can&apos;t buy any more of this item!.</p>
      )}
      {currSize === undefined ? <p className={styles.error}>Please select a size.</p> : validText}

      {currSize === undefined ? null : (
        <div className={styles.buttonRow}>
          {!inStock || maxCanBuy <= 1 ? null : (
            <div className={styles.quantityColumn}>
              <h4>Quantity</h4>
              <Dropdown
                name={`options${myID}`}
                ariaLabel={`Dropdown to select the number of items to purchase for ${myID}`}
                options={optionArr}
                value={`${amountToBuy}`}
                onChange={val => onAmountChange(Number(val))}
              />
            </div>
          )}

          <button
            className={`${inStock && maxCanBuy > 0 ? styles.buttonInStock : styles.buttonNoStock} ${
              styles.button
            }`}
            type="button"
            value={buyButtonText}
            onClick={() => {
              onCartChange(!inCart);
            }}
            disabled={!inStock || maxCanBuy === 0}
          >
            {' '}
            {buyButtonText}{' '}
          </button>
        </div>
      )}
    </div>
  );
};
export default AddCartButton;
