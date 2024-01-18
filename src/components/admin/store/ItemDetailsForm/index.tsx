import EventDetailsFormItem from '@/components/admin/event/EventDetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { StoreAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { MerchItem } from '@/lib/types/apiRequests';
import { PublicMerchCollection, PublicMerchItem } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from './style.module.scss';

type FormValues = Omit<MerchItem, 'uuid' | 'merchPhotos' | 'options'>;

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: Omit<Partial<PublicMerchItem>, 'collection'> & {
    collection?: string | PublicMerchCollection;
  };
  collections: PublicMerchCollection[];
}

const ItemDetailsForm = ({ mode, defaultData = {}, collections }: IProps) => {
  const router = useRouter();
  const initialValues: FormValues = {
    itemName: defaultData.itemName ?? '',
    collection:
      typeof defaultData.collection === 'string'
        ? defaultData.collection
        : defaultData.collection?.uuid ?? '',
    description: defaultData.description ?? '',
    monthlyLimit: defaultData.monthlyLimit ?? 1,
    lifetimeLimit: defaultData.lifetimeLimit ?? 1,
    hidden: defaultData.hidden ?? false,
    hasVariantsEnabled: defaultData.hasVariantsEnabled ?? false,
    // merchPhotos: defaultData.merchPhotos ?? [],
    // options: defaultData.options ?? [],
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => reset(initialValues);

  const createItem: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    try {
      const { uuid } = await StoreAPI.createItem(AUTH_TOKEN, {
        ...formData,
        merchPhotos: [],
        options: [],
      });
      showToast('Item created successfully!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(`${config.store.itemRoute}/${uuid}`),
        },
      ]);
      router.push(`${config.store.itemRoute}/${uuid}/edit`);
    } catch (error) {
      reportError('Could not create item', error);
    } finally {
      setLoading(false);
    }
  };

  const editItem: SubmitHandler<FormValues> = async formData => {
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

  const deleteItem = async () => {
    setLoading(true);
    const AUTH_TOKEN = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
    try {
      await StoreAPI.deleteItem(AUTH_TOKEN, defaultData.uuid ?? '');
      showToast('Item details saved!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(config.store.homeRoute),
        },
      ]);
      router.push(config.store.homeRoute);
    } catch (error) {
      reportError('Could not delete item', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(mode === 'edit' ? editItem : createItem)}>
      <h1>{mode === 'edit' ? 'Modify' : 'Create'} Store Item</h1>

      <div className={style.form}>
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

        <label htmlFor="description">Description</label>
        <EventDetailsFormItem error={errors.description?.message}>
          <textarea
            id="description"
            {...register('description', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="collection">Collection</label>
        <EventDetailsFormItem error={errors.collection?.message}>
          <select
            id="collection"
            placeholder="General"
            {...register('collection', {
              required: 'Required',
            })}
          >
            {collections.map(collection => (
              <option key={collection.uuid} value={collection.uuid}>
                {collection.title}
              </option>
            ))}
          </select>
        </EventDetailsFormItem>

        <label htmlFor="monthlyLimit">Monthly limit</label>
        <EventDetailsFormItem error={errors.monthlyLimit?.message}>
          <input
            type="number"
            id="monthlyLimit"
            {...register('monthlyLimit', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>

        <label htmlFor="lifetimeLimit">Lifetime limit</label>
        <EventDetailsFormItem error={errors.lifetimeLimit?.message}>
          <input
            type="number"
            id="lifetimeLimit"
            {...register('lifetimeLimit', {
              required: 'Required',
            })}
          />
        </EventDetailsFormItem>
      </div>

      <EventDetailsFormItem error={errors.hidden?.message}>
        <label>
          <input type="checkbox" {...register('hidden')} />
          &nbsp;Hidden?
        </label>
      </EventDetailsFormItem>

      <EventDetailsFormItem error={errors.hasVariantsEnabled?.message}>
        <label>
          <input type="checkbox" id="hasVariantsEnabled" {...register('hasVariantsEnabled')} />
          &nbsp;Has variants?
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
