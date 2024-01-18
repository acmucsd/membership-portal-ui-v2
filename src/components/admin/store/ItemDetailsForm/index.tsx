import EventDetailsFormItem from '@/components/admin/event/EventDetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { StoreAPI } from '@/lib/api';
import { AdminEventManager } from '@/lib/managers';
import { CookieService } from '@/lib/services';
import { FillInLater } from '@/lib/types';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from './style.module.scss';

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: Partial<PublicMerchItem>;
}

const ItemDetailsForm = ({ mode, defaultData = {} }: IProps) => {
  const router = useRouter();
  const initialValues: Omit<PublicMerchItem, 'uuid'> = {
    itemName: defaultData.itemName ?? '',
    collection: defaultData.collection,
    description: defaultData.description ?? '',
    monthlyLimit: defaultData.monthlyLimit ?? 1,
    lifetimeLimit: defaultData.lifetimeLimit ?? 1,
    hidden: defaultData.hidden ?? false,
    hasVariantsEnabled: defaultData.hasVariantsEnabled ?? false,
    merchPhotos: defaultData.merchPhotos ?? [],
    options: defaultData.options ?? [],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicMerchItem>({ defaultValues: initialValues });

  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => reset(initialValues);

  const createItem: SubmitHandler<FillInLater> = async formData => {
    setLoading(true);

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    try {
      const { uuid } = await StoreAPI.createItem(AUTH_TOKEN, formData);
      showToast('Item created successfully!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(`${config.admin.store.items}/${uuid}`),
        },
      ]);
      router.push(`${config.admin.store.items}/${uuid}/edit`);
    } catch (error) {
      reportError('Could not create item', error);
    } finally {
      setLoading(false);
    }
  };

  const editItem: SubmitHandler<FillInLater> = async formData => {
    setLoading(true);

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    try {
      const { uuid } = await StoreAPI.editItem(AUTH_TOKEN, defaultData.uuid ?? '', formData);
      showToast('Item details saved!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(`${config.admin.store.items}/${uuid}`),
        },
      ]);
      router.push(`${config.admin.store.items}/${uuid}/edit`);
    } catch (error) {
      reportError('Could not save changes', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = () => {
    setLoading(true);
    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    AdminEventManager.deleteEvent({
      event: defaultData.uuid ?? '',
      token: AUTH_TOKEN,
      onSuccessCallback: () => {
        setLoading(false);
        router.push(config.admin.events.homeRoute);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(mode === 'edit' ? editItem : createItem)}>
      <h1>{mode === 'edit' ? 'Modify' : 'Create'} store item</h1>
      <label htmlFor="name">Item name</label>
      <EventDetailsFormItem error={errors.itemName?.message}>
        <input
          type="text"
          id="name"
          placeholder="ACM Cafe"
          {...register('itemName', {
            required: 'Required',
          })}
        />
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
            <Button onClick={deleteItem} disabled={loading} destructive>
              Delete item
            </Button>
          </>
        ) : (
          <>
            <Button type="submit" disabled={loading}>
              Create item
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

export default ItemDetailsForm;
