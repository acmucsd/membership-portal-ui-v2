import { Modal } from '@/components/common';
import EventDetail from '@/components/events/EventDetail';
import { PublicEvent } from '@/lib/types/apiResponses';

interface EventModalProps {
  open: boolean;
  attended: boolean;
  event: PublicEvent;
  onClose: () => void;
}

const EventModal = ({ open, attended, event, onClose }: EventModalProps) => {
  return (
    <Modal open={open} onClose={onClose} bottomSheet>
      <EventDetail event={event} attended={attended} showCloseBtn />
    </Modal>
  );
};

export default EventModal;
