import { useEffect, useId, useState } from 'react';
import styles from './style.module.scss';

interface AddCartButtonProps {
  currSize: 'S' | 'M' | 'L' | 'XL' | undefined;
  // Justification for disabling rules: This seems to be a false positive.
  // https://stackoverflow.com/q/63767199/
  // eslint-disable-next-line no-unused-vars
  inStock: boolean;
  inCart: boolean;
  setInCart: (value: boolean) => void;
}

const AddCartButton = ({ currSize, inStock, inCart, setInCart }: AddCartButtonProps) => {
  const [mounted, setMounted] = useState(false);

  const smallId = `small${useId()}`;
  const mediumId = `medium${useId()}`;
  const largeId = `large${useId()}`;
  const xlId = `XL${useId()}`;

  // NEED TO CHANGE ACTUAL LABEL, NOT SOME EXTERNAL DIV. CAN'T USE + B/C OF ODD LINTING ERRORS

  const currAltText = `TODO`;

  useEffect(() => {
    console.log(`currSize ${currSize} inStock ${inStock} inCart ${inCart}`);
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

  const buttonStyle = inStock ? styles.buttonInStock : styles.buttonNoStock;

  return (
    <div className={styles.addCartGroup}>
      <p>You can buy up to XXXXX of this item.</p>
      <p>{`In cart: ${inCart}`}</p>
      {currSize === undefined ? <p className={styles.error}>Please select a size.</p> : validText}
      <input
        className={`${buttonStyle} ${styles.button}`}
        type="button"
        value={inStock ? 'Add to Cart' : 'Out of Stock'}
        onClick={() => {
          setInCart(!inCart);
        }}
      />
    </div>
  );
};
export default AddCartButton;

// Links for knowledge:
