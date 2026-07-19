import DetailsFormItem from '@/components/admin/DetailsFormItem';
import NotionAutofill from '@/components/admin/event/NotionAutofill';
import { Button, Cropper } from '@/components/common';
import { config, showToast } from '@/lib';
import { KlefkiAPI } from '@/lib/api';
import dmSans from '@/lib/constants/fontFamily';
import useConfirm from '@/lib/hooks/useConfirm';
import { AdminEventManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import { FillInLater } from '@/lib/types';
import { Event } from '@/lib/types/apiRequests';
import { NotionEventDetails, NotionEventPreview, PublicEvent } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { exportCanvas, reportError, useObjectUrl } from '@/lib/utils';
import { DateTime } from 'luxon';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from './style.module.scss';

function drawTempCover(
  context: CanvasRenderingContext2D,
  backgroundImage: HTMLImageElement | null,
  eventTitle: string,
  eventStart: string,
  eventEnd: string,
  eventLocation: string,
  eventLink?: string
) {
  const c = context; // To bypass eslint(no-param-reassign)
  const start = new Date(eventStart);
  const end = new Date(eventEnd);
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  if (backgroundImage) {
    c.drawImage(backgroundImage, 0, 0);
  }
  c.fillStyle = '#333333';
  c.textAlign = 'center';
  c.textBaseline = 'top';
  c.font = `bold 80px ${dmSans.style.fontFamily}, sans-serif`;
  c.fillText(eventTitle, 969, 340);
  if (eventStart && eventEnd) {
    c.font = `45px ${dmSans.style.fontFamily}, sans-serif`;
    c.fillText(
      new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).formatRange(start, end),
      969,
      460
    );
    c.fillText(
      new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).formatRange(
        start,
        // Force `end` to be the same date as `start` so it only renders a time range
        new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          end.getHours(),
          end.getMinutes()
        )
      ),
      969,
      510
    );
  }
  c.font = `500 45px ${dmSans.style.fontFamily}, sans-serif`;
  c.fillText(eventLocation, 969, 670);
  c.font = `45px ${dmSans.style.fontFamily}, sans-serif`;
  c.textAlign = 'left';
  c.fillStyle = 'white';
  c.fillText(eventLink || 'acmucsd.com', 756, 810);
}

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
    eventLink: defaultData?.eventLink,
    foodItems: defaultData?.foodItems,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    const { checkin, title, description, start, end, location, community, acmurl } = data;
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
    setValue('eventLink', acmurl);
    setValue('committee', community);
  };

  const resetForm = () => reset(initialValues);

  const [selectedCover, setSelectedCover] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const coverUrl = useObjectUrl(cover);
  const eventCover = coverUrl || initialValues.cover;

  const createEvent: SubmitHandler<FillInLater> = async formData => {
    const { start: isoStart, end: isoEnd, ...event } = formData;

    const start = new Date(isoStart).toISOString();
    const end = new Date(isoEnd).toISOString();

    let eventCover = cover;
    if (!eventCover) {
      const backgroundImage = await new Promise<HTMLImageElement | null>(resolve => {
        const image = new window.Image();
        image.src = `/assets/event-cover-templates/${
          event.committee?.toLowerCase() || 'general'
        }.png`;
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', () => resolve(null));
      });
      if (!backgroundImage) {
        showToast(
          'Event cover is required.',
          'Unable to create temporary cover: failed to load background image.'
        );
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const context = canvas.getContext('2d');
      if (!context) {
        showToast(
          'Event cover is required.',
          'Unable to create temporary cover: failed to create canvas context.'
        );
        return;
      }
      drawTempCover(
        context,
        backgroundImage,
        event.title,
        isoStart,
        isoEnd,
        event.location,
        event.eventLink
      );
      const blob = await exportCanvas(canvas, config.file.MAX_EVENT_COVER_SIZE_KB * 1024);
      if (!blob) {
        showToast('Event cover is required.', 'Unable to create temporary cover: image too large.');
        return;
      }
      eventCover = new File(
        [blob],
        blob.type === 'image/png' ? 'temp-cover.png' : 'temp-cover.jpg',
        { type: blob.type }
      );
    }

    setLoading(true);

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    AdminEventManager.createNewEvent({
      token: AUTH_TOKEN,
      event: {
        ...event,
        start,
        end,
      },
      cover: eventCover,
      onSuccessCallback: event => {
        setLoading(false);
        showToast('Event Created Successfully!', '', [
          {
            text: 'View Live Event Page',
            onClick: () => router.push(`https://acmucsd.com/events/${event.uuid}`),
          },
        ]);
        router.push(config.admin.events.homeRoute);
      },
      onFailCallback: error => {
        setLoading(false);
        reportError('Unable to create event', error);
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
      cover: cover || undefined,
      onSuccessCallback: event => {
        setLoading(false);
        showToast('Event Details Saved!', '', [
          {
            text: 'View Event',
            onClick: () => router.push(`https://acmucsd.com/events/${event.uuid}`),
          },
        ]);
        router.push(config.admin.events.homeRoute);
      },
      onFailCallback: error => {
        setLoading(false);
        reportError('Unable to create event', error);
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
        router.push(config.admin.events.homeRoute);
      },
      onFailCallback: error => {
        setLoading(false);
        reportError('Unable to create event', error);
      },
    });
  };

  const confirmDelete = useConfirm({
    title: 'Confirm deletion',
    question: 'Are you sure you want to delete this event? This cannot be undone.',
    action: 'Delete',
  });
  const confirmReset = useConfirm({
    title: 'Confirm reset',
    question: 'Are you sure you want to reset this form? This cannot be undone.',
    action: 'Reset',
  });

  const [eventCommittee, eventTitle, eventStart, eventEnd, eventLocation, eventLink] = watch([
    'committee',
    'title',
    'start',
    'end',
    'location',
    'eventLink',
  ]);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (context.current) {
      drawTempCover(
        context.current,
        null,
        eventTitle,
        eventStart,
        eventEnd,
        eventLocation,
        eventLink
      );
    }
  }, [eventTitle, eventStart, eventEnd, eventLocation, eventLink]);

  return (
    <div className={style.container}>
      {confirmDelete.modal}
      {confirmReset.modal}
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
        <DetailsFormItem error={errors.title?.message}>
          <input
            type="text"
            id="name"
            placeholder="ACM Cafe"
            {...register('title', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="committee">Community</label>
        <DetailsFormItem error={errors.committee?.message}>
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
        </DetailsFormItem>

        <label htmlFor="location">Location</label>
        <DetailsFormItem error={errors.location?.message}>
          <input
            type="text"
            id="location"
            placeholder="Design and Innovation Building 202"
            {...register('location', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="points">Points</label>
        <DetailsFormItem error={errors.pointValue?.message}>
          <input
            type="number"
            id="points"
            {...register('pointValue', {
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

        <label htmlFor="checkin">Check In Code</label>
        <DetailsFormItem error={errors.attendanceCode?.message}>
          <input
            type="text"
            id="checkin"
            {...register('attendanceCode', {
              required: 'Required',
            })}
          />
        </DetailsFormItem>

        <label htmlFor="foodItems">Food (if A.S. Funded)</label>
        <DetailsFormItem error={errors.foodItems?.message}>
          <input type="text" id="foodItems" {...register('foodItems')} />
        </DetailsFormItem>

        <label htmlFor="eventLink">Event Link</label>
        <DetailsFormItem error={errors.eventLink?.message}>
          <input type="text" id="eventLink" {...register('eventLink')} />
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

        <label htmlFor="cover">Cover Image</label>
        <DetailsFormItem>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={e => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = '';
              if (file) {
                setSelectedCover(file);
              }
            }}
          />
          {eventCover ? (
            <div className={style.eventCover}>
              <Image
                src={eventCover}
                alt="Selected cover image"
                style={{ objectFit: 'cover' }}
                fill
              />
            </div>
          ) : (
            <canvas
              width={1920}
              height={1080}
              className={style.eventAutoCover}
              style={{
                backgroundImage: `url("/assets/event-cover-templates/${
                  eventCommittee?.toLowerCase() || 'general'
                }.png")`,
              }}
              ref={canvas => {
                context.current = canvas?.getContext('2d') ?? null;
              }}
            />
          )}
        </DetailsFormItem>
        <Cropper
          file={selectedCover}
          aspectRatio={1920 / 1080}
          maxFileHeight={1080}
          maxSize={config.file.MAX_EVENT_COVER_SIZE_KB * 1024}
          onCrop={async file => {
            setCover(
              new File([file], selectedCover?.name ?? 'image', {
                type: file.type,
              })
            );
            setSelectedCover(null);
          }}
          onClose={() => setSelectedCover(null)}
        />
      </div>

      <div className={style.submitButtons}>
        {editing ? (
          <>
            <Button onClick={handleSubmit(editEvent)} disabled={loading}>
              Save Changes
            </Button>
            <Button onClick={() => confirmReset.confirm(resetForm)} disabled={loading} destructive>
              Discard Changes
            </Button>
            <Button
              onClick={() => confirmDelete.confirm(deleteEvent)}
              disabled={loading}
              destructive
            >
              Delete Event
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleSubmit(createEvent)} disabled={loading}>
              Create Event
            </Button>
            <Button onClick={() => confirmReset.confirm(resetForm)} disabled={loading} destructive>
              Clear Form
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetailsForm;
