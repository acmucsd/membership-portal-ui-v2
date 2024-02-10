import DetailsFormItem from '@/components/admin/DetailsFormItem';
import { Button, Cropper } from '@/components/common';
import Draggable, { DRAG_HANDLE } from '@/components/common/Draggable';
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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsArrowRight, BsGripVertical, BsPlus } from 'react-icons/bs';
import style from './style.module.scss';

type FormValues = Omit<MerchItem, 'uuid' | 'hasVariantsEnabled' | 'merchPhotos' | 'options'>;
type Photo =
  | { uuid: UUID; uploadedPhoto: string }
  | { uuid?: undefined; blob: Blob; uploadedPhoto: string };
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
  metadata,
}: PublicMerchItemOption): Option => ({
  uuid,
  price: String(price),
  oldQuantity: quantity,
  quantity: String(quantity),
  discountPercentage: String(discountPercentage),
  value: metadata?.value ?? '',
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
    typeof defaultData === 'string' ? null : defaultData ?? null
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

  const defaultOptionType = lastSaved?.options?.[0]?.metadata?.type || '';
  const [optionType, setOptionType] = useState(defaultOptionType);
  const defaultOptions = lastSaved?.options
    ?.sort((a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0))
    .map(stringifyOption) ?? [
    {
      price: '',
      quantity: '',
      discountPercentage: '0',
      value: '',
    },
  ];
  const [options, setOptions] = useState<Option[]>(defaultOptions);

  const defaultMerchPhotos = lastSaved?.merchPhotos?.sort((a, b) => a.position - b.position) ?? [];
  const [merchPhotos, setMerchPhotos] = useState<Photo[]>(defaultMerchPhotos);
  const [photo, setPhoto] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    reset(initialValues);
    setOptionType(defaultOptionType);
    setOptions(defaultOptions);
    setMerchPhotos(defaultMerchPhotos);
  };

  const createItem: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    try {
      const item = await StoreAPI.createItem(token, {
        ...formData,
        hasVariantsEnabled: options.length > 1,
        merchPhotos: [],
        options: options.map((option, position) => ({
          price: +option.price,
          quantity: +option.quantity,
          discountPercentage: +option.discountPercentage,
          metadata:
            options.length > 1 ? { type: optionType, value: option.value, position } : undefined,
        })),
      });
      setLastSaved(item);
      setOptions(
        item.options
          .sort((a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0))
          .map(stringifyOption)
      );
      // Upload photos after creating item
      setMerchPhotos(
        await Promise.all(
          merchPhotos.map(photo =>
            photo.uuid !== undefined
              ? photo
              : StoreAPI.createItemPhoto(token, item.uuid, photo.blob)
          )
        )
      );
      showToast('Item created successfully!', '', [
        {
          text: 'View public item page',
          onClick: () => router.push(`${config.store.itemRoute}/${item.uuid}`),
        },
      ]);
      router.replace(`${config.store.itemRoute}/${item.uuid}`);
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
        (!lastSaved.hasVariantsEnabled || lastSaved.options[0]?.metadata?.type !== optionType)
      ) {
        await StoreAPI.editItem(token, uuid, {
          hasVariantsEnabled: true,
          options: lastSaved.options.map(({ uuid, metadata }, position) => ({
            uuid,
            metadata: metadata
              ? { ...metadata, type: optionType }
              : { type: optionType, value: `${position}`, position },
          })),
        });
      }
      // Add new options and photos before deleting old ones
      const newOptions = await Promise.all(
        options.map(async (option, position) => {
          const edits = {
            price: +option.price,
            quantity: +option.quantity,
            discountPercentage: +option.discountPercentage,
            metadata:
              options.length > 1 ? { type: optionType, value: option.value, position } : undefined,
          };
          return option.uuid
            ? {
                uuid: option.uuid,
                ...edits,
                quantityToAdd: edits.quantity - (option.oldQuantity ?? 0),
              }
            : StoreAPI.createItemOption(token, uuid, edits).then(({ metadata, ...option }) => ({
                ...option,
                metadata:
                  options.length > 1
                    ? { type: optionType, value: metadata?.value ?? '', position }
                    : undefined,
              }));
        })
      );
      const newMerchPhotos = await Promise.all(
        merchPhotos.map(async (photo, position) => {
          if (photo.uuid !== undefined) {
            return { uuid: photo.uuid, position };
          }
          // When `photo.blob` exists, `uploadedPhoto` contains the object URL
          URL.revokeObjectURL(photo.uploadedPhoto);
          return { ...(await StoreAPI.createItemPhoto(token, uuid, photo.blob)), position };
        })
      );
      // Delete removed options and photos
      await Promise.all(
        lastSaved.options
          .filter(option => !options.some(o => o.uuid === option.uuid))
          .map(({ uuid }) => StoreAPI.deleteItemOption(token, uuid))
      );
      await Promise.all(
        lastSaved.merchPhotos
          .filter(photo => !merchPhotos.some(p => p.uuid === photo.uuid))
          .map(({ uuid }) => StoreAPI.deleteItemPhoto(token, uuid))
      );
      const item = await StoreAPI.editItem(token, uuid, {
        ...formData,
        hasVariantsEnabled: options.length > 1,
        options: newOptions,
        merchPhotos: newMerchPhotos,
      });
      setLastSaved(item);
      setOptions(
        item.options
          .sort((a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0))
          .map(stringifyOption)
      );
      setMerchPhotos(item.merchPhotos.sort((a, b) => a.position - b.position));
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
    <>
      <form onSubmit={handleSubmit(mode === 'edit' ? editItem : createItem)}>
        <div className={style.header}>
          <h1>{mode === 'edit' ? 'Modify' : 'Create'} Store Item</h1>

          {lastSaved ? (
            <Link className={style.viewPage} href={`${config.store.itemRoute}${lastSaved.uuid}`}>
              View store listing
              <BsArrowRight aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className={style.form}>
          <label htmlFor="name">Item name</label>
          <DetailsFormItem error={errors.itemName?.message}>
            <input
              type="text"
              id="name"
              placeholder="ACM Raccoon Sticker"
              {...register('itemName', { required: 'Required' })}
            />
          </DetailsFormItem>

          <label htmlFor="description">Description</label>
          <DetailsFormItem error={errors.description?.message}>
            <textarea id="description" {...register('description', { required: 'Required' })} />
          </DetailsFormItem>

          <label htmlFor="collection">Collection</label>
          <DetailsFormItem error={errors.collection?.message}>
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
          </DetailsFormItem>

          <label htmlFor="monthlyLimit">Monthly limit</label>
          <DetailsFormItem error={errors.monthlyLimit?.message}>
            <input
              type="number"
              id="monthlyLimit"
              {...register('monthlyLimit', { valueAsNumber: true, required: 'Required', min: 0 })}
            />
          </DetailsFormItem>

          <label htmlFor="lifetimeLimit">Lifetime limit</label>
          <DetailsFormItem error={errors.lifetimeLimit?.message}>
            <input
              type="number"
              id="lifetimeLimit"
              {...register('lifetimeLimit', { valueAsNumber: true, required: 'Required', min: 0 })}
            />
          </DetailsFormItem>
        </div>

        <ul className={style.photos}>
          <Draggable items={merchPhotos} onReorder={setMerchPhotos}>
            {(props, photo, i) => (
              <li key={photo.uuid ?? i} {...props}>
                <Image
                  className={DRAG_HANDLE}
                  src={photo.uploadedPhoto}
                  alt="Uploaded photo of store item"
                  draggable={false}
                  fill
                />
                <Button
                  onClick={() => {
                    setMerchPhotos(merchPhotos.filter((_, index) => index !== i));
                    if (photo.uuid === undefined) {
                      URL.revokeObjectURL(photo.uploadedPhoto);
                    }
                  }}
                  destructive
                >
                  Remove
                </Button>
              </li>
            )}
          </Draggable>
          <li>
            <label className={style.addImage}>
              <BsPlus aria-hidden />
              Add image
              <input
                type="file"
                id="cover"
                accept="image/*"
                onChange={e => {
                  const file = e.currentTarget.files?.[0];
                  e.currentTarget.value = '';
                  if (file) {
                    setPhoto(file);
                  }
                }}
              />
            </label>
          </li>
        </ul>

        <div className={style.tableScroller}>
          <table className={`${style.options} ${options.length > 1 ? style.multipleOptions : ''}`}>
            <thead>
              <tr>
                {options.length > 1 ? (
                  <>
                    <th />
                    <th>
                      <input
                        type="text"
                        name="category-type"
                        aria-label="Option type"
                        placeholder="Size, color, ..."
                        required
                        value={optionType}
                        onChange={e => setOptionType(e.currentTarget.value)}
                      />
                    </th>
                  </>
                ) : null}
                <th>Price</th>
                <th>Quantity available</th>
                <th>Percent discount</th>
                {options.length > 1 ? <th>Remove</th> : null}
              </tr>
            </thead>
            <tbody>
              <Draggable items={options} onReorder={setOptions}>
                {(props, option, i) => (
                  <tr key={option.uuid || i} {...props}>
                    {options.length > 1 ? (
                      <>
                        <td>
                          <BsGripVertical className={`${DRAG_HANDLE} ${style.grip}`} />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="category-value"
                            aria-label={optionType}
                            required
                            value={option.value}
                            onChange={e =>
                              setOptions(
                                options.map((option, index) =>
                                  index === i ? { ...option, value: e.currentTarget.value } : option
                                )
                              )
                            }
                          />
                        </td>
                      </>
                    ) : null}
                    <td>
                      <input
                        type="number"
                        name="price"
                        aria-label="Price"
                        min={0}
                        value={option.price}
                        onChange={e =>
                          setOptions(
                            options.map((option, index) =>
                              index === i ? { ...option, price: e.currentTarget.value } : option
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        aria-label="Quantity"
                        min={0}
                        value={option.quantity}
                        onChange={e =>
                          setOptions(
                            options.map((option, index) =>
                              index === i ? { ...option, quantity: e.currentTarget.value } : option
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="discount-percentage"
                        aria-label="Percent discount"
                        min={0}
                        max={100}
                        value={option.discountPercentage}
                        onChange={e =>
                          setOptions(
                            options.map((option, index) =>
                              index === i
                                ? { ...option, discountPercentage: e.currentTarget.value }
                                : option
                            )
                          )
                        }
                      />
                    </td>
                    {options.length > 1 ? (
                      <td>
                        <Button
                          onClick={() => setOptions(options.filter((_, index) => index !== i))}
                          destructive
                        >
                          Remove
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                )}
              </Draggable>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={10}>
                  <Button
                    onClick={() =>
                      setOptions([
                        ...options,
                        { price: '', quantity: '', discountPercentage: '0', value: '' },
                      ])
                    }
                  >
                    Add option
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <DetailsFormItem error={errors.hidden?.message}>
          <label>
            <input type="checkbox" {...register('hidden')} />
            &nbsp;Hide this item from the public storefront
          </label>
        </DetailsFormItem>

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
      <Cropper
        file={photo}
        aspectRatio={1}
        maxSize={config.file.MAX_MERCH_PHOTO_SIZE_KB * 1024}
        maxFileHeight={1080}
        onCrop={async blob => {
          setMerchPhotos(photos => [...photos, { blob, uploadedPhoto: URL.createObjectURL(blob) }]);
          setPhoto(null);
        }}
        onClose={reason => {
          setPhoto(null);
          if (reason === 'cannot-compress') {
            showToast(
              'Your image has too much detail and cannot be compressed.',
              'Try shrinking your image.'
            );
          } else if (reason !== null) {
            showToast('This image format is not supported.');
          }
        }}
      />
    </>
  );
};

export default ItemDetailsForm;