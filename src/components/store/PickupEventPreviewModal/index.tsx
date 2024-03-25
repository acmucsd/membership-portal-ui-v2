import { Button, Dropdown, Modal, Typography } from '@/components/common';
import { showToast } from '@/lib';
import { PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { formatEventDate, getDefaultEventCover, reportError } from '@/lib/utils';
import CloseIcon from '@/public/assets/icons/close-icon.svg';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import styles from './style.module.scss';

interface PickupEventPreviewModalProps {
  open: boolean;
  onClose: () => void;
  // The original pickup event connected to the order.
  pickupEvent: PublicOrderPickupEvent;
  reschedulePickupEvent: (pickup: PublicOrderPickupEvent) => Promise<void>;
  futurePickupEvents: PublicOrderPickupEvent[];
  reschedulable?: boolean;
}

const PickupEventPreviewModal = ({
  open,
  onClose,
  pickupEvent,
  reschedulePickupEvent,
  reschedulable,
  futurePickupEvents,
}: PickupEventPreviewModalProps) => {
  // UUID + event for the updated pickup event.
  // We need to store these separately because Dropdown can only take strings as values.
  const [rescheduledPickupUUID, setRescheduledPickupUUID] = useState<string>(pickupEvent.uuid);
  const [rescheduledPickupEvent, setRescheduledPickupEvent] =
    useState<PublicOrderPickupEvent>(pickupEvent);
  // Mapping UUIDs to events so we can update rescheduledPickupEvent down the line.
  const pickupEventsByUUID = useMemo(
    () => new Map<string, PublicOrderPickupEvent>(futurePickupEvents.map(e => [e.uuid, e])),
    [futurePickupEvents]
  );
  // Stores if the pickup event has been changed from the original.
  const pickupModified = pickupEvent.uuid !== rescheduledPickupUUID;

  const { linkedEvent, title, start, end, description } = rescheduledPickupEvent;
  const hasLinkedEvent = linkedEvent !== null;
  const pickupEventCover = getDefaultEventCover(linkedEvent?.cover);

  const rescheduleOrderPickup = async (pickup: string) => {
    const pickupEvent = pickupEventsByUUID.get(pickup);
    if (pickupEvent) {
      reschedulePickupEvent(pickupEvent)
        .then(() => showToast('Order pickup rescheduled!', pickupEvent.title))
        .catch(e => reportError("Couldn't reschedule pickup", e))
        .finally(onClose);
    }
  };

  useEffect(() => {
    // Update the displayed pickup event for the user to see details.
    const pickupEvent = pickupEventsByUUID.get(rescheduledPickupUUID);
    if (pickupEvent) {
      setRescheduledPickupEvent(pickupEvent);
    }
  }, [rescheduledPickupUUID, pickupEventsByUUID]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h2/bold" className={styles.heading}>
            Pickup Event Details
          </Typography>
          <button type="submit" className={styles.close} aria-label="Close">
            <CloseIcon aria-hidden />
          </button>
        </div>
        <div className={styles.contents}>
          <div className={styles.pickupEvent}>
            <div className={styles.image}>
              <Image
                src={pickupEventCover}
                alt="Pickup Event Cover Image"
                style={{ objectFit: 'cover' }}
                fill
              />
            </div>
            <div className={styles.details}>
              <div className={styles.eventInfo}>
                <Typography variant="h2/bold" className={styles.title}>
                  {title}
                </Typography>
                <Typography variant="h2/regular" className={styles.title}>
                  {formatEventDate(start, end)}
                </Typography>
                {hasLinkedEvent ? (
                  <Typography variant="h3/regular">{linkedEvent?.location}</Typography>
                ) : null}
              </div>
              <Typography variant="body/medium">{description}</Typography>
            </div>
          </div>

          {reschedulable ? (
            <div className={styles.reschedule}>
              <Typography variant="h2/bold" className={styles.title}>
                Reschedule Pickup
              </Typography>
              <Dropdown
                className={styles.dropdown}
                name="reschedulePickup"
                ariaLabel="Select a new pickup event"
                options={futurePickupEvents.map(e => {
                  return {
                    value: e.uuid,
                    label: `${e.title} (${formatEventDate(e.start, e.end)})`,
                  };
                })}
                value={rescheduledPickupUUID}
                onChange={v => setRescheduledPickupUUID(v)}
              />
              <div className={styles.rescheduleButtons}>
                <Button
                  onClick={() => rescheduleOrderPickup(rescheduledPickupUUID)}
                  disabled={!pickupModified}
                >
                  Reschedule Pickup
                </Button>
                <Button variant="secondary" submit>
                  Close
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};

export default PickupEventPreviewModal;
