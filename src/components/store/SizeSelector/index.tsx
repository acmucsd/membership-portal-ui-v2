import styles from '@/components/store/SizeSelector/style.module.scss';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { Fragment, useEffect, useId, useState } from 'react';

interface SizeSelectorProps {
  currSize: string | undefined;
  uuid: string;
  options: PublicMerchItemOption[];
  // eslint-disable-next-line no-unused-vars
  onSizeChange: (currSize: string) => void;
}

const SizeSelector = ({ currSize, options, onSizeChange, uuid }: SizeSelectorProps) => {
  const [mounted, setMounted] = useState(false);
  const myID = useId();

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
          onClick={() => onSizeChange(val.metadata?.value)}
        />
        <label htmlFor={tempId}>{val.metadata?.value}</label>
      </>
    );
  });

  return (
    <div className={styles.sizeSelector}>
      {options.length > 1 ? (
        <Fragment key={uuid}>
          <h4>Size</h4>
          <form className={styles.switch}>{myOptions}</form>
        </Fragment>
      ) : null}
    </div>
  );
};
export default SizeSelector;