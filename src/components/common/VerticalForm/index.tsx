import { CSSProperties, PropsWithChildren } from 'react';
import styleModule from './style.module.scss';

interface VerticalFormProps {
  onEnterPress?: () => void;
  style?: CSSProperties;
}

const VerticalForm = (props: PropsWithChildren<VerticalFormProps>) => {
  const { children = null, onEnterPress = () => {}, style = {} } = props;

  return (
    <section
      style={style}
      className={styleModule.verticalForm}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onEnterPress?.();
        }
      }}
      role="presentation"
    >
      {children}
    </section>
  );
};

export default VerticalForm;
