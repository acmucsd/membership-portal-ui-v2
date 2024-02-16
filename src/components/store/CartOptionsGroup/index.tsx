import { Dropdown, Typography } from '@/components/common';
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

  // 20 is a number decided upon to prevent large maximum purchase limits from crashing the webpage
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

  // Fills values of the Dropdown to be increasing sequential numbers
  const optionArr: Array<{ value: string; label: string }> = Array(maxCanBuy)
    .fill({ value: `${1}`, label: `${1}` })
    .map((i, index) => {
      return { value: `${Number(i.value) + index}`, label: `${Number(i.label) + index}` };
    });

  return (
    <div className={styles.addCartGroup}>
      {maxCanBuy > 0 ? (
        <Typography variant="h5/regular">You can buy up to {maxCanBuy} of this item.</Typography>
      ) : (
        <Typography variant="h5/regular">You can&apos;t buy any more of this item!.</Typography>
      )}
      {currOption === undefined && optionsKey != null ? (
        <Typography variant="h5/regular" className={styles.error}>
          {`Please select a ${optionsKey?.toLocaleLowerCase() ?? 'option'}`}.
        </Typography>
      ) : null}

      {currOption === undefined && optionsKey != null ? null : (
        <div className={styles.buttonRow}>
          {!inStock || maxCanBuy <= 1 ? null : (
            <div className={styles.quantityColumn}>
              <Typography variant="h4/bold">Quantity</Typography>
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
