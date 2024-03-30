import { Modal } from '@/components/common';
import EventDetail from '@/components/events/EventDetail';
import { config } from '@/lib';
import { PublicEvent } from '@/lib/types/apiResponses';
import Link from 'next/link';
import { useMemo } from 'react';

interface EventModalProps {
  open: boolean;
  attended: boolean;
  event: PublicEvent;
  onClose: () => void;
}

const EventModal = ({ open, attended, event, onClose }: EventModalProps) => {
  const started = useMemo(() => new Date() >= new Date(event.start), [event.start]);

  return (
    <Modal open={open} onClose={onClose} bottomSheet>
      <EventDetail event={event} attended={attended} showCloseBtn />
      {started ? (
        <Link
          href={`${config.eventsRoute}/${event.uuid}`}
          style={{ color: 'var(--theme-blue-text-button)' }}
        >
          Give feedback
        </Link>
      ) : null}
    </Modal>
  );
};

export default EventModal;
