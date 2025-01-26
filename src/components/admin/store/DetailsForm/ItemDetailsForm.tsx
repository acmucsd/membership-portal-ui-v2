import DetailsFormItem from '@/components/admin/DetailsFormItem';
import { Photo } from '@/components/admin/store/DetailsForm/types';
import ItemOptionsEditor, { type Option } from '@/components/admin/store/ItemOptionsEditor';
import { Button, Cropper, DRAG_HANDLE, Draggable } from '@/components/common';
import { config, showToast } from '@/lib';
import useConfirm from '@/lib/hooks/useConfirm';
import { AdminStoreManager } from '@/lib/managers';
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
import { BsArrowRight, BsPlus } from 'react-icons/bs';
import style from './style.module.scss';

type FormValues = Omit<MerchItem, 'uuid' | 'hasVariantsEnabled' | 'merchPhotos' | 'options'>;

const stringifyOption = ({
  uuid,
  price,
  quantity,
  discountPercentage,
  metadata,
}: PublicMerchItemOption): Option => ({
  uuid,
  price: String(price),
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

  const defaultPhotos = lastSaved?.merchPhotos?.sort((a, b) => a.position - b.position) ?? [];
  const [photos, setPhotos] = useState<Photo[]>(defaultPhotos);
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
    setPhotos(defaultPhotos);
  };

  const createItem: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    try {
      const uuid = await AdminStoreManager.createNewItem(
        token,
        {
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
        },
        photos.flatMap(photo => (photo.uuid !== undefined ? [] : [photo.blob]))
      );
      showToast('Item created successfully!', '', [
        {
          text: 'Continue editing',
          onClick: () => router.push(`${config.store.itemRoute}/${uuid}/edit`),
        },
      ]);
      router.replace(`${config.store.itemRoute}/${uuid}`);
    } catch (error) {
      reportError('Could not create item', error);
      setLoading(false);
    }
  };

  const editItem: SubmitHandler<FormValues> = async formData => {
    if (!lastSaved) {
      throw new Error('`editItem` called on create item page.');
    }
    setLoading(true);

    try {
      const { uuid } = lastSaved;
      const item = await AdminStoreManager.editItem(
        token,
        uuid,
        lastSaved,
        formData,
        optionType,
        options.map(option => ({
          price: +option.price,
          quantity: +option.quantity,
          discountPercentage: +option.discountPercentage,
          uuid: option.uuid,
          variant: option.value,
        })),
        photos.map(photo => (photo.uuid !== undefined ? photo.uuid : photo.blob))
      );
      setLastSaved(item);
      setOptions(
        item.options
          .sort((a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0))
          .map(stringifyOption)
      );
      photos.forEach(photo => {
        if (!photo.uuid) {
          URL.revokeObjectURL(photo.uploadedPhoto);
        }
      });
      setPhotos(item.merchPhotos.sort((a, b) => a.position - b.position));
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
      await AdminStoreManager.deleteItem(token, lastSaved.uuid);
      showToast('Item deleted successfully');
      router.replace(config.store.homeRoute);
    } catch (error) {
      reportError('Could not delete item', error);
      setLoading(false);
    }
  };

  const confirmDelete = useConfirm({
    title: 'Confirm deletion',
    question: 'Are you sure you want to delete this collection? This cannot be undone.',
    action: 'Delete',
  });
  const confirmReset = useConfirm({
    title: 'Confirm reset',
    question: 'Are you sure you want to reset this form? This cannot be undone.',
    action: 'Reset',
  });

  return (
    <>
      {confirmDelete.modal}
      {confirmReset.modal}
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
          <Draggable items={photos} onReorder={setPhotos}>
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
                    setPhotos(photos.filter((_, index) => index !== i));
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

        <ItemOptionsEditor
          options={options}
          onOptions={setOptions}
          optionType={optionType}
          onOptionType={setOptionType}
        />

        <DetailsFormItem error={errors.hidden?.message}>
          <label>
            <input type="checkbox" {...register('hidden')} />
            &nbsp;Hide this item from the public storefront
          </label>
        </DetailsFormItem>

        <div className={style.submitButtons}>
          {mode === 'edit' ? (
            <>
              <Button submit disabled={loading}>
                Save changes
              </Button>
              <Button
                onClick={() => confirmReset.confirm(resetForm)}
                disabled={loading}
                destructive
              >
                Discard changes
              </Button>
              <Button
                onClick={() => confirmDelete.confirm(deleteItem)}
                disabled={loading}
                destructive
              >
                Delete item
              </Button>
            </>
          ) : (
            <>
              <Button submit disabled={loading}>
                Create item
              </Button>
              <Button
                onClick={() => confirmReset.confirm(resetForm)}
                disabled={loading}
                destructive
              >
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
          setPhotos(photos => [...photos, { blob, uploadedPhoto: URL.createObjectURL(blob) }]);
          setPhoto(null);
        }}
        onClose={() => setPhoto(null)}
      />
    </>
  );
};

export default ItemDetailsForm;
