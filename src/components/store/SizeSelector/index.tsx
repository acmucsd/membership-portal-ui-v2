import { Typography } from '@/components/common';
import styles from '@/components/store/SizeSelector/style.module.scss';
import { MerchItemOptionMetadata } from '@/lib/types/apiRequests';
import { PublicMerchItemOption } from '@/lib/types/apiResponses';
import { toTitleCase } from '@/lib/utils';
import { Fragment, useId } from 'react';

interface SizeSelectorProps {
  currOption: MerchItemOptionMetadata | undefined;
  options: PublicMerchItemOption[];
  onOptionChange: (currSize: PublicMerchItemOption) => void;
}

const SizeSelector = ({ currOption, options, onOptionChange }: SizeSelectorProps) => {
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
            defaultChecked={currOption?.value === val.metadata?.value}
            onClick={() => onOptionChange(val)}
          />
          <label htmlFor={tempId}>{val.metadata?.value}</label>
        </Fragment>
      );
    });

  return options.length > 1 && options ? (
    <div className={styles.sizeSelector}>
      <Typography variant="h4/bold">
        {options[0]?.metadata?.type === undefined
          ? 'Options'
          : toTitleCase(options[0]?.metadata.type)}
      </Typography>
      <form className={styles.switch}>{myOptions}</form>
    </div>
  ) : null;
};
export default SizeSelector;
