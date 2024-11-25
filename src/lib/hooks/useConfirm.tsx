import { Button, Modal } from '@/components/common';
import { ReactNode, useState } from 'react';

export type UseConfirmOptions = {
  title: string;
  question: string;
  action: string;
  cancel?: string;
};

export type UseConfirmOutput = {
  confirm: (onConfirm: () => void) => void;
  modal: ReactNode;
};

export default function useConfirm({
  title,
  question,
  action,
  cancel = 'Cancel',
}: UseConfirmOptions): UseConfirmOutput {
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  return {
    confirm: onConfirm => setOnConfirm(() => onConfirm),
    modal: (
      <Modal open={onConfirm !== null} onClose={() => setOnConfirm(null)} title={title}>
        <p>{question}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button submit destructive onClick={onConfirm || (() => {})}>
            {action}
          </Button>
          <Button submit variant="secondary">
            {cancel}
          </Button>
        </div>
      </Modal>
    ),
  };
}
