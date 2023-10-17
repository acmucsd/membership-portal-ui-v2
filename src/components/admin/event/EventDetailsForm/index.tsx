import EventDetailsFormItem from '@/components/admin/event/EventDetailsFormItem';
import NotionAutofill from '@/components/admin/event/NotionAutofill';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { KlefkiAPI } from '@/lib/api';
import { AdminEventManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import { FillInLater } from '@/lib/types';
import { Event } from '@/lib/types/apiRequests';
import { NotionEventDetails, NotionEventPreview, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getMessagesFromError } from '@/lib/utils';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from './style.module.scss';

interface IProps {
  editing?: boolean;
  defaultData?: Partial<PublicEvent>;
}

const EventDetailsForm = (props: IProps) => {
  const { editing, defaultData } = props;
  const router = useRouter();
  const initialValues: Partial<PublicEvent> = {
    title: defaultData?.title || '',
    committee: defaultData?.committee || 'General',
    location: defaultData?.location || '',
    pointValue: defaultData?.pointValue || 10,
    start: defaultData?.start || '',
    end: defaultData?.end || '',
    attendanceCode: defaultData?.attendanceCode || '',
    description: defaultData?.description || '',
    cover: defaultData?.cover,
    uuid: defaultData?.uuid,
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Event>({ defaultValues: initialValues });

  const [loading, setLoading] = useState<boolean>(false);
  const [upcomingEvents, setUpcomingEvents] = useState<NotionEventPreview[]>([]);

  // Load in the Notion event options for NotionAutofill using Klefki.
  useEffect(() => {
    setLoading(true);
    KlefkiAPI.getFutureEventsPreview().then(notionUpcomingEvents => {
      setUpcomingEvents(notionUpcomingEvents);
      setLoading(false);
    });
  }, []);

  const setFieldsFromAutofill = (data: NotionEventDetails) => {
    const { checkin, title, description, start, end, location, community } = data;
    setValue('attendanceCode', checkin, { shouldValidate: true });
    setValue('title', title, { shouldValidate: true });
    setValue('description', description, { shouldValidate: true });
    setValue('start', DateTime.fromISO(start).toFormat("yyyy-MM-dd'T'HH:mm") ?? '', {
      shouldValidate: true,
    });
    setValue('end', DateTime.fromISO(end).toFormat("yyyy-MM-dd'T'HH:mm") ?? '', {
      shouldValidate: true,
    });
    setValue('location', location, { shouldValidate: true });
    setValue('committee', community);
  };

  const resetForm = () => reset(initialValues);

  const createEvent: SubmitHandler<FillInLater> = formData => {
    setLoading(true);
    const { start: isoStart, end: isoEnd, ...event } = formData;

    const start = new Date(isoStart).toISOString();
    const end = new Date(isoEnd).toISOString();

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    AdminEventManager.createNewEvent({
      token: AUTH_TOKEN,
      event: {
        ...event,
        start,
        end,
      },
      cover: event.cover[0],
      onSuccessCallback: event => {
        setLoading(false);
        router.push(`/admin/event`);
        showToast('Event Created Successfully!', '', [
          {
            text: 'View Live Event Page',
            onClick: () => router.push(`https://acmucsd.com/events/${event.uuid}`),
          },
        ]);
      },
      onFailCallback: error => {
        setLoading(false);
        showToast('Unable to create event', getMessagesFromError(error).join());
      },
    });
  };

  const editEvent: SubmitHandler<FillInLater> = formData => {
    setLoading(true);
    const { start: isoStart, end: isoEnd, ...event } = formData;

    const start = new Date(isoStart).toISOString();
    const end = new Date(isoEnd).toISOString();

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    AdminEventManager.editEvent({
      token: AUTH_TOKEN,
      uuid: defaultData?.uuid ?? '',
      event: {
        ...event,
        start,
        end,
      },
      onSuccessCallback: event => {
        setLoading(false);
        router.push(`/admin/event/edit/${event.uuid}`);
        showToast('Event Details Saved!', '', [
          {
            text: 'View Event',
            onClick: () => router.push(`https://acmucsd.com/events/${event.uuid}`),
          },
        ]);
      },
      onFailCallback: error => {
        setLoading(false);
        showToast('Unable to create event', getMessagesFromError(error).join());
      },
    });
  };

  const deleteEvent = () => {
    setLoading(true);
    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    AdminEventManager.deleteEvent({
      event: initialValues.uuid ?? '',
      token: AUTH_TOKEN,
      onSuccessCallback: () => {
        setLoading(false);
        router.push('/event');
      },
    });
  };

  return (
    <div className={style.container}>
      <Link href="/admin" className={style.back}>
        Back
      </Link>
      <NotionAutofill
        setFields={setFieldsFromAutofill}
        loading={loading}
        upcomingEvents={upcomingEvents}
      />
      <h1>{editing ? 'Modify' : 'Create'} Event</h1>
      <div className={style.form}>
        <label htmlFor="name">Event Name</label>
        <EventDetailsFormItem error={errors.title?.message}>
          <input
            type="text"
            id="name"
            placeholder="ACM Cafe"
            {...register('title', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="committee">Community</label>
        <EventDetailsFormItem error={errors.committee?.message}>
          <select
            id="committee"
            placeholder="General"
            {...register('committee', {
              required: 'Required',
            })}
          >
            <option>General</option>
            <option>AI</option>
            <option>Cyber</option>
            <option>Hack</option>
            <option>Design</option>
          </select>
        </EventDetailsFormItem>

        <label htmlFor="location">Location</label>
        <EventDetailsFormItem error={errors.location?.message}>
          <input
            type="text"
            id="location"
            placeholder="Design and Innovation Building 202"
            {...register('location', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="points">Points</label>
        <EventDetailsFormItem error={errors.pointValue?.message}>
          <input
            type="number"
            id="points"
            {...register('pointValue', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="start">Starts At</label>
        <EventDetailsFormItem error={errors.start?.message}>
          <input
            type="datetime-local"
            id="start"
            {...register('start', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="end">Ends At</label>
        <EventDetailsFormItem error={errors.end?.message}>
          <input
            type="datetime-local"
            id="end"
            {...register('end', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="checkin">Check In Code</label>
        <EventDetailsFormItem error={errors.attendanceCode?.message}>
          <input
            type="text"
            id="checkin"
            {...register('attendanceCode', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="description">Description</label>
        <EventDetailsFormItem error={errors.description?.message}>
          <textarea
            id="description"
            {...register('description', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        {/* Only show this in create mode */}
        {editing ? null : (
          <>
            <label htmlFor="cover">Cover Image</label>
            <EventDetailsFormItem error={errors.cover?.message}>
              <input
                type="file"
                id="cover"
                accept="image/png, image/gif, image/jpeg"
                {...register('cover', {
                  validate: cover => {
                    const list = cover as FillInLater as FileList;
                    if (list.length === 0) return 'Required';
                    if (list.length > 1) return 'Only 1 image upload is allowed';
                    if ((list.item(0)?.size ?? 0) >= config.file.MAX_EVENT_COVER_SIZE_KB * 1024) {
                      return 'File is too large';
                    }
                    return true;
                  },
                })}
              />
            </EventDetailsFormItem>
          </>
        )}
      </div>

      <div className={style.submitButtons}>
        {editing ? (
          <>
            <Button onClick={handleSubmit(editEvent)} disabled={loading}>
              Save Changes
            </Button>
            <Button onClick={resetForm} disabled={loading} destructive>
              Discard Changes
            </Button>
            <Button onClick={deleteEvent} disabled={loading} destructive>
              Delete Event
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleSubmit(createEvent)} disabled={loading}>
              Create Event
            </Button>
            <Button onClick={resetForm} disabled={loading} destructive>
              Clear Form
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetailsForm;
