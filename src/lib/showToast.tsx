import Button from '@/components/common/Button';
import { toast, type ToastOptions } from 'react-toastify';

interface ButtonOptions {
  text: string;
  onClick: () => void;
}

const showToast = (
  title: string,
  subtitle?: string,
  buttons?: ButtonOptions[],
  options?: ToastOptions
) => {
  toast(
    <div
      style={{
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          color: '#000000d9',
          fontSize: '16px',
          lineHeight: '24px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {subtitle}
      </div>
      {buttons ? (
        <div
          style={{
            display: 'flex',
            gap: '8px',
          }}
        >
          {buttons.map(({ text, onClick }) => (
            <Button key={text} onClick={onClick} size="small">
              {text}
            </Button>
          ))}
        </div>
      ) : null}
    </div>,
    options
  );
};

export default showToast;
