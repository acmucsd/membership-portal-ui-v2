import styles from '@/components/store/SizeSelector/style.module.scss';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { Fragment, useId } from 'react';

interface SizeSelectorProps {
  currSize: string | undefined;
  uuid: string;
  options: PublicMerchItemOption[];
  onSizeChange: (currSize: string) => void;
}

const SizeSelector = ({ currSize, options, onSizeChange, uuid }: SizeSelectorProps) => {
  const myID = useId();

  const myOptions = options.map(val => {
    const tempId = val.metadata?.value ? `${val.metadata.value}${myID}` : `${val.uuid}${myID}`;
    return (
      <Fragment key={tempId}>
        <input
          id={tempId}
          name="state-d"
          type="radio"
          defaultChecked={currSize === val.metadata?.value}
          onClick={() => onSizeChange(val.metadata?.value)}
        />
        <label htmlFor={tempId}>{val.metadata?.value}</label>
      </Fragment>
    );
  });

  return (
    <div className={styles.sizeSelector}>
      {options.length > 1 ? (
        <>
          <h4>Size</h4>
          <form className={styles.switch}>{myOptions}</form>
        </>
      ) : null}
    </div>
  );
};
export default SizeSelector;
