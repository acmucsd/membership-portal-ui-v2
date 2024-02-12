import styles from '@/components/store/SizeSelector/style.module.scss';
import { MerchItemOptionMetadata } from '@/lib/types/apiRequests';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { Fragment, useId } from 'react';

interface SizeSelectorProps {
  currOption: MerchItemOptionMetadata | undefined;
  options: PublicMerchItemOption[];
  onOptionChange: (currSize: PublicMerchItemOption) => void;
}
function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\.\s*([a-z])|^[a-z]/gm, s => s.toUpperCase());
}

const SizeSelector = ({ currOption, options, onOptionChange }: SizeSelectorProps) => {
  const myID = useId();
  const myOptions = options.map(val => {
    const tempId = val.metadata.value ? `${val.metadata.value}${myID}` : `${val.uuid}${myID}`;
    return (
      <Fragment key={tempId}>
        <input
          id={tempId}
          name="state-d"
          type="radio"
          defaultChecked={currOption?.value === val.metadata?.value}
          onClick={() => onOptionChange(val)}
        />
        <label htmlFor={tempId}>{val.metadata?.value}</label>
      </Fragment>
    );
  });

  return options.length > 1 && options ? (
    <div className={styles.sizeSelector}>
      {options[0]?.metadata.type === undefined ? (
        <h4>Options</h4>
      ) : (
        <h4>{toTitleCase(options[0]?.metadata.type)}</h4>
      )}
      <form className={styles.switch}>{myOptions}</form>
    </div>
  ) : null;
};
export default SizeSelector;
