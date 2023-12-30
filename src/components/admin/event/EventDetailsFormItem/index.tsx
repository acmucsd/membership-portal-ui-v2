import { PropsWithChildren } from 'react';
import style from './style.module.scss';

interface IProps {
  error?: string;
}

const EventDetailsFormItem = (props: PropsWithChildren<IProps>) => {
  const { error, children } = props;

  return (
    <div className={style.formItem} data-error={Boolean(error)}>
      {children}
      <p className={style.formError}>{error}</p>
    </div>
  );
};

export default EventDetailsFormItem;
