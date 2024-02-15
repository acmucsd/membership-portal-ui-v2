import { Dropdown } from '@/components/common';
import { useId } from 'react';
import styles from './style.module.scss';

interface CartOptionGroupProps {
  currOption: string | undefined;
  inStock: boolean;
  inCart: boolean;
  lifetimeRemaining: number;
  monthlyRemaining: number;
  amountToBuy: number;
  optionsKey: string;
  onCartChange: (inCart: boolean) => void;
  onAmountChange: (amountToBuy: number) => void;
}

const CartOptionsGroup = ({
  currOption,
  inStock,
  inCart,
  onCartChange,
  lifetimeRemaining,
  monthlyRemaining,
  amountToBuy,
  optionsKey,
  onAmountChange,
}: CartOptionGroupProps) => {
  const myID = useId();

  const maxCanBuy = Math.min(20, Math.min(lifetimeRemaining, monthlyRemaining));

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

  const optionArr: Array<{ value: string; label: string }> = [];

  for (let i = 1; i <= maxCanBuy; i += 1) {
    optionArr.push({ value: `${i}`, label: `${i}` });
  }

  return (
    <div className={styles.addCartGroup}>
      {maxCanBuy > 0 ? (
        <p>You can buy up to {maxCanBuy} of this item.</p>
      ) : (
        <p>You can&apos;t buy any more of this item!.</p>
      )}
      {currOption === undefined && optionsKey != null ? (
        <p className={styles.error}>
          {`Please select a ${optionsKey?.toLocaleLowerCase() ?? 'option'}`}.
        </p>
      ) : null}

      {currOption === undefined && optionsKey != null ? null : (
        <div className={styles.buttonRow}>
          {!inStock || maxCanBuy <= 1 ? null : (
            <div className={styles.quantityColumn}>
              <h4>Quantity</h4>
              <Dropdown
                name={`options${currOption}_${optionsKey}${myID}`}
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
            onClick={() => onCartChange(!inCart)}
            disabled={!inStock || maxCanBuy === 0}
          >
            {buyButtonText}
          </button>
        </div>
      )}
    </div>
  );
};
export default CartOptionsGroup;
