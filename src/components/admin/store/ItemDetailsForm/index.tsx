import EventDetailsFormItem from '@/components/admin/event/EventDetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { StoreAPI } from '@/lib/api';
import { UUID } from '@/lib/types';
import { MerchItem } from '@/lib/types/apiRequests';
import {
  PublicMerchCollection,
  PublicMerchItem,
  PublicMerchItemOption,
} from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from './style.module.scss';

type FormValues = Omit<MerchItem, 'uuid' | 'hasVariantsEnabled' | 'merchPhotos' | 'options'>;
type Photo = {
  uuid?: UUID;
  uploadedPhoto: string;
};
type Option = {
  uuid?: UUID;
  price: string;
  oldQuantity?: number;
  quantity: string;
  discountPercentage: string;
  value: string;
};
const stringifyOption = ({
  uuid,
  price,
  quantity,
  discountPercentage,
  metadata: { value },
}: PublicMerchItemOption): Option => ({
  uuid,
  price: String(price),
  oldQuantity: quantity,
  quantity: String(quantity),
  discountPercentage: String(discountPercentage),
  value,
});

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: PublicMerchItem | UUID;
  token: string;
  collections: PublicMerchCollection[];
}

const ItemDetailsForm = ({ mode, defaultData, token, collections }: IProps) => {
  const router = useRouter();
  const [lastSaved, setLastSaved] = useState<PublicMerchItem | null>(
    typeof defaultData === 'string' ? null : defaultData
  );
  const initialValues: FormValues = useMemo(
    () => ({
      itemName: lastSaved?.itemName ?? '',
      collection:
        lastSaved?.collection?.uuid ?? (typeof defaultData === 'string' ? defaultData : ''),
      description: lastSaved?.description ?? '',
      monthlyLimit: lastSaved?.monthlyLimit ?? 1,
      lifetimeLimit: lastSaved?.lifetimeLimit ?? 1,
      hidden: lastSaved?.hidden ?? true,
    }),
    [lastSaved, defaultData]
  );
  const defaultMerchPhotos = lastSaved?.merchPhotos?.sort((a, b) => a.position - b.position) ?? [];
  const [merchPhotos, setMerchPhotos] = useState<Photo[]>(defaultMerchPhotos);
  const defaultOptionType = lastSaved?.options?.[0]?.metadata?.type || '';
  const [optionType, setOptionType] = useState(defaultOptionType);
  const defaultOptions = lastSaved?.options
    ?.sort((a, b) => a.metadata.position - b.metadata.position)
    .map(stringifyOption) ?? [
    {
      price: '',
      quantity: '',
      discountPercentage: '0',
      value: '',
    },
  ];
  const [options, setOptions] = useState<Option[]>(defaultOptions);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    reset(initialValues);
    setMerchPhotos(defaultMerchPhotos);
    setOptionType(defaultOptionType);
    setOptions(defaultOptions);
  };

  const createItem: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    try {
      const item = await StoreAPI.createItem(token, {
        ...formData,
        hasVariantsEnabled: options.length > 1,
        merchPhotos: [], // TEMP
        options: options.map((option, i) => ({
          price: +option.price,
          quantity: +option.quantity,
          discountPercentage: +option.discountPercentage,
          metadata:
            options.length > 1 ? { type: optionType, value: option.value, position: i } : undefined,
        })),
      });
      setLastSaved(item);
      setOptions(
        item.options.sort((a, b) => a.metadata.position - b.metadata.position).map(stringifyOption)
      );
      showToast('Item created successfully!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(`${config.store.itemRoute}/${item.uuid}`),
        },
      ]);
      router.push(`${config.store.itemRoute}/${item.uuid}/edit`);
    } catch (error) {
      reportError('Could not create item', error);
    } finally {
      setLoading(false);
    }
  };

  const editItem: SubmitHandler<FormValues> = async formData => {
    if (!lastSaved) {
      throw new Error('`editItem` called on create item page.');
    }
    const { uuid } = lastSaved;
    setLoading(true);
    try {
      // If we need to add new options, ensure that `hasVariantsEnabled` is
      // enabled and update all existing options' `type` so the new options'
      // `type` match.
      if (
        options.length > 1 &&
        options.some(option => !option.uuid) &&
        (!lastSaved.hasVariantsEnabled || lastSaved.options[0]?.metadata.type !== optionType)
      ) {
        await StoreAPI.editItem(token, uuid, {
          hasVariantsEnabled: true,
          options: lastSaved.options.map(({ uuid, metadata }) => ({
            uuid,
            metadata: { ...metadata, type: optionType },
          })),
        });
      }
      // Delete removed options
      await Promise.all(
        lastSaved.options
          .filter(option => !options.some(o => o.uuid === option.uuid))
          .map(({ uuid }) => StoreAPI.deleteItemOption(token, uuid))
      );
      const item = await StoreAPI.editItem(token, uuid, {
        ...formData,
        hasVariantsEnabled: options.length > 1,
        merchPhotos: [], // TEMP
        options: await Promise.all(
          options.map(async (option, i) => {
            const edits = {
              price: +option.price,
              quantity: +option.quantity,
              discountPercentage: +option.discountPercentage,
              metadata:
                options.length > 1
                  ? { type: optionType, value: option.value, position: i }
                  : undefined,
            };
            return option.uuid
              ? {
                  uuid: option.uuid,
                  ...edits,
                  quantityToAdd: edits.quantity - (option.oldQuantity ?? 0),
                }
              : StoreAPI.createItemOption(token, uuid, edits);
          })
        ),
      });
      setLastSaved(item);
      setOptions(
        item.options.sort((a, b) => a.metadata.position - b.metadata.position).map(stringifyOption)
      );
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
    if (!lastSaved) {
      return;
    }
    setLoading(true);
    try {
      await StoreAPI.deleteItem(token, lastSaved.uuid);
      showToast('Item deleted successfully');
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

      {lastSaved && (
        <Link href={`${config.store.itemRoute}${lastSaved.uuid}`}>View store listing</Link>
      )}

      <div className={style.form}>
        <label htmlFor="name">Item name</label>
        <EventDetailsFormItem error={errors.itemName?.message}>
          <input
            type="text"
            id="name"
            placeholder="ACM Cafe"
            {...register('itemName', { required: 'Required' })}
          />
        </EventDetailsFormItem>

        <label htmlFor="description">Description</label>
        <EventDetailsFormItem error={errors.description?.message}>
          <textarea id="description" {...register('description', { required: 'Required' })} />
        </EventDetailsFormItem>

        <label htmlFor="collection">Collection</label>
        <EventDetailsFormItem error={errors.collection?.message}>
          <select
            id="collection"
            placeholder="General"
            {...register('collection', { required: 'Required' })}
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
            {...register('monthlyLimit', { valueAsNumber: true, required: 'Required' })}
          />
        </EventDetailsFormItem>

        <label htmlFor="lifetimeLimit">Lifetime limit</label>
        <EventDetailsFormItem error={errors.lifetimeLimit?.message}>
          <input
            type="number"
            id="lifetimeLimit"
            {...register('lifetimeLimit', { valueAsNumber: true, required: 'Required' })}
          />
        </EventDetailsFormItem>
      </div>

      <EventDetailsFormItem error={errors.hidden?.message}>
        <label>
          <input type="checkbox" {...register('hidden')} />
          &nbsp;Hide this item from the public storefront
        </label>
      </EventDetailsFormItem>

      <table>
        <thead>
          <tr>
            {options.length > 1 && (
              <th>
                <input
                  type="text"
                  name="category-type"
                  aria-label="Option type"
                  placeholder="Size, color, ..."
                  value={optionType}
                  onChange={e => setOptionType(e.currentTarget.value)}
                />
              </th>
            )}
            <th>Price</th>
            <th>Quantity</th>
            <th>Percent discount</th>
            {options.length > 1 && <th>Remove</th>}
          </tr>
        </thead>
        <tbody>
          {options.map((option, i) => (
            <tr key={option.uuid || i}>
              {options.length > 1 && (
                <td>
                  <input
                    type="text"
                    name="category-value"
                    aria-label={optionType}
                    value={option.value}
                    onChange={e =>
                      setOptions(options.with(i, { ...option, value: e.currentTarget.value }))
                    }
                  />
                </td>
              )}
              <td>
                <input
                  type="number"
                  name="price"
                  aria-label="Price"
                  value={option.price}
                  onChange={e =>
                    setOptions(options.with(i, { ...option, price: e.currentTarget.value }))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  name="quantity"
                  aria-label="Quantity"
                  value={option.quantity}
                  onChange={e =>
                    setOptions(options.with(i, { ...option, quantity: e.currentTarget.value }))
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  name="discount-percentage"
                  aria-label="Percent discount"
                  value={option.discountPercentage}
                  onChange={e =>
                    setOptions(
                      options.with(i, { ...option, discountPercentage: e.currentTarget.value })
                    )
                  }
                />
              </td>
              {options.length > 1 && (
                <td>
                  <Button onClick={() => setOptions(options.toSpliced(i, 1))} destructive>
                    Remove
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Button
                onClick={() =>
                  setOptions([
                    ...options,
                    { price: '', quantity: '', discountPercentage: '', value: '' },
                  ])
                }
              >
                Add option
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>

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
