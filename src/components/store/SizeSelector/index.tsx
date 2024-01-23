import styles from '@/components/store/SizeSelector/style.module.scss';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { Fragment, useId } from 'react';

interface SizeSelectorProps {
  currSize: string | undefined;
  options: PublicMerchItemOption[];
  onSizeChange: (currSize: string) => void;
}

const SizeSelector = ({ currSize, options, onSizeChange }: SizeSelectorProps) => {
  const myID = useId();

  const myOptions = options
    .sort((a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0))
    .map(val => {
      const tempId = val.metadata?.value ? `${val.metadata.value}${myID}` : `${val.uuid}${myID}`;
      return (
        <Fragment key={tempId}>
          <input
            id={tempId}
            name="state-d"
            type="radio"
            defaultChecked={currSize === val.metadata?.value}
            onClick={() => val.metadata && onSizeChange(val.metadata.value)}
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
