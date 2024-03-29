import DetailsFormItem from '@/components/admin/DetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { AdminEventManager } from '@/lib/managers';
import { OrderPickupEvent } from '@/lib/types/apiRequests';
import { PublicEvent, PublicOrderPickupEvent } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

const AdminPickupEventForm = ({ mode, defaultData = {}, token, upcomingEvents }: IProps) => {
  const router = useRouter();

  const initialValues: FormValues = {
    title: defaultData.title ?? '',
    start: DateTime.fromISO(defaultData?.start ?? '').toFormat("yyyy-MM-dd'T'HH:mm"),
    end: DateTime.fromISO(defaultData?.end ?? '').toFormat("yyyy-MM-dd'T'HH:mm"),
    description: defaultData.description ?? '',
    orderLimit: 0,
    linkedEventUuid: defaultData.linkedEvent?.uuid ?? '',
  };

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
          onClick: () => router.push(`${config.admin.store.pickup}/${uuid}`),
        },
      ]);
      // router.replace(`${config.eventsRoute}/${uuid}`);
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
      const uuid = await AdminEventManager.editPickupEvent({
        pickupEvent: { title, start, end, description, orderLimit, linkedEventUuid },
        uuid: defaultData.uuid ?? '',
        token: token,
      });
      showToast('Event details saved!', '', [
        {
          text: 'View pickup event page',
          onClick: () => router.push(`${config.admin.store.pickup}/${uuid}`),
        },
      ]);
    } catch (error) {
      reportError('Could not save changes', error);
    } finally {
      setLoading(false);
    }
  };

  // const deletePickupEvent = async () => {
  //   setLoading(true);

  //   try {
  //     await AdminEventManager.deletePickupEvent(token, defaultData.uuid ?? '');
  //     showToast('Pickup event deleted successfully');
  //     router.replace(config.store.homeRoute);
  //   } catch (error) {
  //     reportError('Could not delete collection', error);
  //     setLoading(false);
  //   }
  // };

  const defaultFormText = loading ? 'Loading events from API...' : 'Select an Event';

  return (
    <form onSubmit={handleSubmit(mode === 'edit' ? editPickupEvent : createPickupEvent)}>
      <div className={style.header}>
        <h1>{mode === 'edit' ? 'Modify' : 'Create'} Pickup Event</h1>

        {defaultData.uuid ? (
          <Link className={style.viewPage} href={`${config.eventsRoute}${defaultData.uuid}`}>
            View event page
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
            {...register('linkedEventUuid', {
              required: 'Required',
            })}
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
            <Button submit disabled={loading}>
              Save changes
            </Button>
            <Button onClick={resetForm} disabled={loading} destructive>
              Discard changes
            </Button>
            {/* <Button onClick={deletePickupEvent} disabled={loading} destructive>
              Delete pickup event
            </Button> */}
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
