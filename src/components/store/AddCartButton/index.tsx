import { Dropdown } from '@/components/common';
import { useId, useState } from 'react';
import styles from './style.module.scss';

interface AddCartButtonProps {
  currSize: string | undefined;
  inStock: boolean;
  inCart: boolean;
  lifetimeRemaining: number;
  monthlyRemaining: number;
  // Justification for disabling rules: This seems to be a false positive.
  // https://stackoverflow.com/q/63767199/
  // eslint-disable-next-line no-unused-vars
  onCartChange: (inCart: boolean) => void;
}

const AddCartButton = ({
  currSize,
  inStock,
  inCart,
  onCartChange: setInCart,
  lifetimeRemaining,
  monthlyRemaining,
}: AddCartButtonProps) => {
  const [amount, setAmount] = useState<number>(1);

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

      {currSize === undefined || maxCanBuy === 0 ? null : (
        <div className={styles.buttonRow}>
          {!inStock || maxCanBuy === 0 ? null : (
            <div className={styles.quantityColumn}>
              <h4>Quantity</h4>
              <Dropdown
                name={`options${myID}`}
                ariaLabel={`Dropdown to select the number of items to purchase for ${myID}`}
                options={optionArr}
                value={`${amount}`}
                onChange={val => setAmount(Number(val))}
              />
            </div>
          )}

          <button
            className={`${inStock ? styles.buttonInStock : styles.buttonNoStock} ${styles.button}`}
            type="button"
            title={`${buyButtonText} Button`}
            value={buyButtonText}
            onClick={() => {
              setInCart(!inCart);
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
