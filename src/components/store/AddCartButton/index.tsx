import { Dropdown } from '@/components/common';
import { useEffect, useId, useState } from 'react';
import styles from './style.module.scss';

interface AddCartButtonProps {
  currSize: string | undefined;
  // Justification for disabling rules: This seems to be a false positive.
  // https://stackoverflow.com/q/63767199/
  // eslint-disable-next-line no-unused-vars
  inStock: boolean;
  inCart: boolean;
  lifetimeRemaining: number;
  montlyRemaining: number;
  setInCart: (value: boolean) => void;
}

const AddCartButton = ({
  currSize,
  inStock,
  inCart,
  setInCart,
  lifetimeRemaining,
  montlyRemaining,
}: AddCartButtonProps) => {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState<number>(1);

  const myID = useId();

  const maxCanBuy = Math.min(lifetimeRemaining, montlyRemaining);

  useEffect(() => {
    // console.log(`currSize ${currSize} inStock ${inStock} inCart ${inCart}`);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const validText = inStock ? (
    <p className={styles.valid}>This item is in stock.</p>
  ) : (
    <p className={styles.error}>This item is out of stock.</p>
  );

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
      <p>{`In cart: ${inCart}`}</p>
      {currSize === undefined ? <p className={styles.error}>Please select a size.</p> : validText}
      <div className={styles.buttonRow}>
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

        <input
          className={`${inStock ? styles.buttonInStock : styles.buttonNoStock} ${styles.button}`}
          type="button"
          value={inStock ? 'Add to Cart' : 'Out of Stock'}
          onClick={() => {
            setInCart(!inCart);
          }}
          disabled={!(inStock || maxCanBuy > 0)}
        />
      </div>
    </div>
  );
};
export default AddCartButton;

// Links for knowledge:
