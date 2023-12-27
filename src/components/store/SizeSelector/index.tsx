import styles from '@/components/store/SizeSelector/style.module.scss';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { useEffect, useId, useState } from 'react';

interface SizeSelectorProps {
  currSize: string | undefined;
  options: PublicMerchItemOption[];
  // Justification for disabling rules: This seems to be a false positive.
  // https://stackoverflow.com/q/63767199/
  // eslint-disable-next-line no-unused-vars
  setSize: (value: string) => void;
}

const SizeSelector = ({ currSize, options, setSize }: SizeSelectorProps) => {
  const [mounted, setMounted] = useState(false);

  // const smallId = `small${useId()}`;
  // const mediumId = `medium${useId()}`;
  // const largeId = `large${useId()}`;
  // const xlId = `XL${useId()}`;
  const myID = `${useId()}`;

  // NEED TO CHANGE ACTUAL LABEL, NOT SOME EXTERNAL DIV. CAN'T USE + B/C OF ODD LINTING ERRORS

  // const currAltText = `TODO`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const myOptions = options.map(val => {
    const tempId = val.metadata?.value ? `${val.metadata.value}${myID}` : `${val.uuid}${myID}`;
    return (
      <>
        <input
          id={tempId}
          name="state-d"
          type="radio"
          defaultChecked={currSize === val.metadata?.value}
          onClick={() => setSize(val.metadata?.value)}
        />
        <label htmlFor={tempId}>{val.metadata?.value}</label>
      </>
    );
  });

  return (
    <div className={styles.sizeSelector}>
      {options.length > 1 && (
        <>
          <h4>Size</h4>
          <form className={styles.switch}>{myOptions}</form>
        </>
      )}
    </div>
  );
};
export default SizeSelector;

// Links for knowledge:
// https://medium.com/@vincent.bocquet/typescript-with-react-usestate-hook-f701309384a

/* <input
    id={smallId}
    name="state-d"
    type="radio"
    defaultChecked={currSize === 'S'}
    onClick={() => setSize('S')}
  />
  <label htmlFor={smallId}>S</label>

  <input
    id={mediumId}
    name="state-d"
    type="radio"
    defaultChecked={currSize === 'M'}
    onClick={() => setSize('M')}
  />
  <label htmlFor={mediumId}>M</label>

  <input
    id={largeId}
    name="state-d"
    type="radio"
    defaultChecked={currSize === 'L'}
    onClick={() => setSize('L')}
  />
  <label htmlFor={largeId}>L</label>

  <input
    id={xlId}
    name="state-d"
    type="radio"
    defaultChecked={currSize === 'XL'}
    onClick={() => setSize('XL')}
  />
  <label htmlFor={xlId}>XL</label> */
