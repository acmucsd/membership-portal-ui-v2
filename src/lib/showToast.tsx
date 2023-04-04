import { toast, type ToastOptions } from 'react-toastify';

const showToast = (title: string, subtitle?: string, options?: ToastOptions) => {
  toast(
    <div
      style={{
        padding: '16px 24px',
      }}
    >
      <div
        style={{
          marginBottom: '8px',
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
        }}
      >
        {subtitle}
      </div>
    </div>,
    options
  );
};

export default showToast;
