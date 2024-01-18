import EventDetailsFormItem from '@/components/admin/event/EventDetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { StoreAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { MerchCollection } from '@/lib/types/apiRequests';
import { PublicMerchCollection } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from '../ItemDetailsForm/style.module.scss';

type FormValues = MerchCollection;

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: Partial<PublicMerchCollection>;
}

const CollectionDetailsForm = ({ mode, defaultData = {} }: IProps) => {
  const router = useRouter();
  const initialValues: FormValues = {
    title: defaultData.title ?? '',
    // ACM blue
    themeColorHex: defaultData.themeColorHex ?? '#62b0ff',
    description: defaultData.description ?? '',
    archived: defaultData.archived ?? false,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => reset(initialValues);

  const createCollection: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    try {
      const { uuid } = await StoreAPI.createCollection(AUTH_TOKEN, formData);
      showToast('Collection created successfully!', '', [
        {
          text: 'View public collection page',
          onClick: () => router.push(`${config.store.collectionRoute}/${uuid}`),
        },
      ]);
      router.push(`${config.store.collectionRoute}/${uuid}/edit`);
    } catch (error) {
      reportError('Could not create item', error);
    } finally {
      setLoading(false);
    }
  };

  const editCollection: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    const uuid = defaultData.uuid ?? '';
    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    try {
      await StoreAPI.editItem(AUTH_TOKEN, uuid, formData);
      showToast('Item details saved!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(`${config.store.itemRoute}/${uuid}`),
        },
      ]);
    } catch (error) {
      reportError('Could not save changes', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCollection = async () => {
    setLoading(true);
    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    try {
      await StoreAPI.deleteCollection(AUTH_TOKEN, defaultData.uuid ?? '');
      showToast('Collection deleted successfully');
      router.push(config.store.homeRoute);
    } catch (error) {
      reportError('Could not delete item', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(mode === 'edit' ? editCollection : createCollection)}>
      <h1>{mode === 'edit' ? 'Modify' : 'Create'} Collection</h1>

      <div className={style.form}>
        <label htmlFor="title">Title</label>
        <EventDetailsFormItem error={errors.title?.message}>
          <input
            type="text"
            id="title"
            placeholder="ACM Cafe"
            {...register('title', {
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

        <label htmlFor="themeColorHex">Theme color</label>
        <EventDetailsFormItem error={errors.themeColorHex?.message}>
          <input
            type="color"
            id="themeColorHex"
            {...register('themeColorHex', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>
      </div>

      <EventDetailsFormItem error={errors.archived?.message}>
        <label>
          <input type="checkbox" {...register('archived')} />
          &nbsp;Archived?
        </label>
      </EventDetailsFormItem>

      <div className={style.submitButtons}>
        {mode === 'edit' ? (
          <>
            <Button type="submit" disabled={loading}>
              Save changes
            </Button>
            <Button onClick={resetForm} disabled={loading} destructive>
              Discard changes
            </Button>
            <Button onClick={deleteCollection} disabled={loading} destructive>
              Delete collection
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" disabled={loading}>
              Create collection
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

export default CollectionDetailsForm;
