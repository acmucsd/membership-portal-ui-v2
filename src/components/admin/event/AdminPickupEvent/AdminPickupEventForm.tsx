import DetailsFormItem from '@/components/admin/DetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { AdminEventManager } from '@/lib/managers';
import { UUID } from '@/lib/types';
import { OrderPickupEvent } from '@/lib/types/apiRequests';
import { PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsArrowRight } from 'react-icons/bs';
import style from './style.module.scss';

type FormValues = OrderPickupEvent;

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: Partial<PublicOrderPickupEvent>;
  token: string;
  upcomingEvents: PublicEvent[];
}

export const completePickupEvent = async (uuid: UUID, token: string) => {
  try {
    await AdminEventManager.completePickupEvent({
      pickupEvent: uuid,
      token: token,
    });

    showToast('Pickup Event Completed Successfully!', '');
    router.push(config.admin.store.pickup);
  } catch (error) {
    reportError('Could not complete pickup event', error);
  }
};

export const cancelPickupEvent = async (uuid: UUID, token: string) => {
  try {
    await AdminEventManager.cancelPickupEvent({
      pickupEvent: uuid,
      token: token,
    });

    showToast('Pickup Event Cancelled Successfully!', '');
    router.push(config.admin.store.pickup);
  } catch (error) {
    reportError('Could not cancel pickup event', error);
  }
};

const AdminPickupEventForm = ({ mode, defaultData = {}, token, upcomingEvents }: IProps) => {
  const router = useRouter();

  const initialValues: FormValues = {
    title: defaultData.title ?? '',
    start: DateTime.fromISO(defaultData?.start ?? '').toFormat("yyyy-MM-dd'T'HH:mm"),
    end: DateTime.fromISO(defaultData?.end ?? '').toFormat("yyyy-MM-dd'T'HH:mm"),
    description: defaultData.description ?? '',
    orderLimit: defaultData.orderLimit ?? 0,
    linkedEventUuid: defaultData.linkedEvent?.uuid ?? null,
  };

  const { uuid } = defaultData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderPickupEvent>({ defaultValues: initialValues });

  const [loading, setLoading] = useState<boolean>(false);
  const resetForm = () => reset(initialValues);

  const createPickupEvent: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    const {
      title,
      start: isoStart,
      end: isoEnd,
      linkedEventUuid,
      description,
      orderLimit: rawOrderLimit,
    } = formData;

    const start = new Date(isoStart).toISOString();
    const end = new Date(isoEnd).toISOString();
    const orderLimit = parseInt(`${rawOrderLimit}`, 10);

    try {
      const uuid = await AdminEventManager.createPickupEvent(token, {
        title,
        start,
        end,
        description,
        orderLimit,
        linkedEventUuid,
      });
      showToast('Pickup Event created successfully!', '', [
        {
          text: 'Continue editing',
          onClick: () => router.push(`${config.admin.store.pickupEdit}/${uuid}`),
        },
      ]);
      router.push(`${config.admin.store.pickup}/${uuid}`);
    } catch (error) {
      reportError('Could not create pickup event', error);
    } finally {
      setLoading(false);
    }
  };

  const editPickupEvent: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    const {
      title,
      start: isoStart,
      end: isoEnd,
      linkedEventUuid,
      description,
      orderLimit: rawOrderLimit,
    } = formData;

    const start = new Date(isoStart).toISOString();
    const end = new Date(isoEnd).toISOString();
    const orderLimit = parseInt(`${rawOrderLimit}`, 10);

    try {
      await AdminEventManager.editPickupEvent({
        pickupEvent: { title, start, end, description, orderLimit, linkedEventUuid },
        uuid: defaultData.uuid ?? '',
        token: token,

        onSuccessCallback: event => {
          setLoading(false);
          showToast('Pickup Event Edit Successfully!', '', [
            {
              text: 'View Live Pickup Event Page',
              onClick: () => router.push(`${config.admin.store.pickup}/${event.uuid}`),
            },
          ]);
        },
        onFailCallback: error => {
          setLoading(false);
          reportError('Unable to edit pickup event', error);
        },
      });
    } catch (error) {
      reportError('Could not save changes', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePickupEvent = async () => {
    setLoading(true);

    try {
      await AdminEventManager.deletePickupEvent({
        pickupEvent: defaultData.uuid ?? '',
        token: token,

        onSuccessCallback: () => {
          setLoading(false);
          showToast('Pickup Event Deleted Successfully!', '');
          router.push(config.admin.store.pickup);
        },
        onFailCallback: error => {
          setLoading(false);
          reportError('Unable to delete pickup event', error);
        },
      });
    } catch (error) {
      reportError('Could not delete pickup event', error);
      setLoading(false);
    }
  };

  const defaultFormText = loading ? 'Loading events from API...' : 'Select an Event';

  return (
    <form onSubmit={handleSubmit(mode === 'edit' ? editPickupEvent : createPickupEvent)}>
      <div className={style.header}>
        <h1>{mode === 'edit' ? 'Modify' : 'Create'} Pickup Event</h1>

        {defaultData.uuid ? (
          <Link
            className={style.viewPage}
            href={`${config.admin.store.pickup}/${defaultData.uuid}`}
          >
            View pickup event page
            <BsArrowRight aria-hidden />
          </Link>
        ) : null}
      </div>

      <div className={style.form}>
        <label htmlFor="title">Title</label>
        <DetailsFormItem error={errors.title?.message}>
          <input
            type="text"
            id="title"
            placeholder="The Raccoon Pickup Event"
            {...register('title', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="start">Starts At</label>
        <DetailsFormItem error={errors.start?.message}>
          <input
            type="datetime-local"
            id="start"
            {...register('start', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="end">Ends At</label>
        <DetailsFormItem error={errors.end?.message}>
          <input
            type="datetime-local"
            id="end"
            {...register('end', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="description">Description</label>
        <DetailsFormItem error={errors.description?.message}>
          <textarea
            id="description"
            {...register('description', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="points">Order Limit</label>
        <DetailsFormItem error={errors.orderLimit?.message}>
          <input
            type="number"
            id="orderLimit"
            {...register('orderLimit', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="LinkedEvent">Linked Event</label>
        <DetailsFormItem error={errors.linkedEventUuid?.message}>
          <select
            id=""
            placeholder={defaultFormText}
            defaultValue={defaultFormText}
            {...register('linkedEventUuid', {})}
          >
            <option disabled>{defaultFormText}</option>

            {upcomingEvents?.map(event => (
              <option key={event.uuid} value={event.uuid}>
                {event.title} ({DateTime.fromISO(event.start).toFormat('f')})
              </option>
            ))}
          </select>
        </DetailsFormItem>
      </div>
      <div className={style.submitButtons}>
        {mode === 'edit' ? (
          <>
            <Button submit disabled={loading} className={style.expandButton}>
              Save changes
            </Button>
            <Button
              onClick={() => completePickupEvent(uuid ?? '', token)}
              disabled={loading}
              className={style.expandButton}
            >
              Complete pickup event
            </Button>
            <Button
              onClick={resetForm}
              disabled={loading}
              destructive
              className={style.expandButton}
            >
              Discard changes
            </Button>
            <Button
              onClick={() => cancelPickupEvent(uuid ?? '', token)}
              disabled={loading}
              destructive
              className={style.expandButton}
            >
              Cancel pickup event
            </Button>
            <Button
              onClick={deletePickupEvent}
              disabled={loading}
              destructive
              className={style.expandButton}
            >
              Delete pickup event
            </Button>
          </>
        ) : (
          <>
            <Button submit disabled={loading}>
              Create pickup event
            </Button>
            <Button onClick={resetForm} disabled={loading} destructive>
              Clear form
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default AdminPickupEventForm;
