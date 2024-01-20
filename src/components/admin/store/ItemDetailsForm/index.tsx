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
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import style from './style.module.scss';

type FormValues = Omit<MerchItem, 'uuid' | 'hasVariantsEnabled' | 'merchPhotos' | 'options'>;
type Option = {
  uuid?: UUID;
  price: string;
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
  quantity: String(quantity),
  discountPercentage: String(discountPercentage),
  value,
});

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: Omit<Partial<PublicMerchItem>, 'collection'> & {
    collection?: string | PublicMerchCollection;
  };
  token: string;
  collections: PublicMerchCollection[];
}

const ItemDetailsForm = ({ mode, defaultData = {}, token, collections }: IProps) => {
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
    hidden: defaultData.hidden ?? true,
  };
  const [merchPhotos, setMerchPhotos] = useState(defaultData.merchPhotos ?? []);
  const [optionType, setOptionType] = useState(defaultData.options?.[0]?.metadata?.type || '');
  const [options, setOptions] = useState<Option[]>(
    defaultData.options
      ?.sort((a, b) => a.metadata.position - b.metadata.position)
      .map(stringifyOption) ?? [
      {
        price: '',
        quantity: '',
        discountPercentage: '0',
        value: '',
      },
    ]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const [loading, setLoading] = useState(false);

  const resetForm = () => reset(initialValues);

  // const createOptionsAsNeeded = async () => {
  //   if (!options.every(option => option.uuid)) {
  //     const newOptions = await Promise.all(options.map(option => option.uuid ? option : StoreAPI.createItemOption(token,uuid,)))
  //     setOptions
  //   }
  // }

  const createItem: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    try {
      const { uuid, options: newOptions } = await StoreAPI.createItem(token, {
        ...formData,
        hasVariantsEnabled: options.length > 1,
        merchPhotos,
        options: options.map((option, i) => ({
          price: +option.price,
          quantity: +option.quantity,
          discountPercentage: +option.discountPercentage,
          metadata:
            options.length > 1
              ? { type: optionType, value: option.value, position: i }
              : { type: 'Size', value: 'Option 1', position: 0 },
        })),
      });
      setOptions(newOptions.map(stringifyOption));
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

    try {
      await StoreAPI.editItem(token, uuid, {
        ...formData,
        hasVariantsEnabled: options.length > 1,
        merchPhotos,
        options,
      });
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
    try {
      await StoreAPI.deleteItem(token, defaultData.uuid ?? '');
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
            <th>Remove</th>
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
              <td>
                <Button onClick={() => setOptions(options.toSpliced(i, 1))} destructive>
                  Remove
                </Button>
              </td>
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
