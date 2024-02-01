import styles from '@/components/store/SizeSelector/style.module.scss';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { Fragment, useId } from 'react';

interface Metadata {
  type: string;
  value: string;
}

interface SizeSelectorProps {
  currSize: Metadata | undefined;
  options: PublicMerchItemOption[];
  onSizeChange: (currSize: Metadata) => void;
}
function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\.\s*([a-z])|^[a-z]/gm, s => s.toUpperCase());
}

const SizeSelector = ({ currSize, options, onSizeChange }: SizeSelectorProps) => {
  const myID = useId();
  const myOptions = options.map(val => {
    const tempId = val.metadata.value ? `${val.metadata.value}${myID}` : `${val.uuid}${myID}`;
    return (
      <Fragment key={tempId}>
        <input
          id={tempId}
          name="state-d"
          type="radio"
          defaultChecked={currSize === val.metadata?.value}
          onClick={() => onSizeChange(val.metadata)}
        />
        <label htmlFor={tempId}>{val.metadata?.value}</label>
      </Fragment>
    );
  });

  return (
    <div className={styles.sizeSelector}>
      {options.length > 1 ? (
        <>
          {options[0]?.metadata.type === undefined ? (
            <h4>Options</h4>
          ) : (
            <h4>{toTitleCase(options[0]?.metadata.type)}</h4>
          )}
          <form className={styles.switch}>{myOptions}</form>
        </>
      ) : null}
    </div>
  );
};
export default SizeSelector;
export type { Metadata };
