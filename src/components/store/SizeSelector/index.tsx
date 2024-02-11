import styles from '@/components/store/SizeSelector/style.module.scss';
import { MerchItemOptionMetadata } from '@/lib/types/apiRequests';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { Fragment, useId } from 'react';

interface SizeSelectorProps {
  currOption: MerchItemOptionMetadata | undefined;
  options: PublicMerchItemOption[];
  onSizeChange: (currSize: MerchItemOptionMetadata) => void;
}
function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\.\s*([a-z])|^[a-z]/gm, s => s.toUpperCase());
}

const SizeSelector = ({ currOption, options, onSizeChange }: SizeSelectorProps) => {
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
            defaultChecked={currOption === val.metadata?.value}
            onClick={() => val.metadata && onSizeChange(val.metadata)}
          />
          <label htmlFor={tempId}>{val.metadata?.value}</label>
        </Fragment>
      );
    });

  return (
    <div className={styles.sizeSelector}>
      {options.length > 1 ? (
        <>
          {options[0]?.metadata?.type === undefined ? (
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
