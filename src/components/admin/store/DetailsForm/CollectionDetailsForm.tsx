import DetailsFormItem from '@/components/admin/DetailsFormItem';
import { Photo } from '@/components/admin/store/DetailsForm/types';
import { Button, Cropper, DRAG_HANDLE, Draggable } from '@/components/common';
import { config, showToast } from '@/lib';
import { AdminStoreManager } from '@/lib/managers';
import { MerchCollection } from '@/lib/types/apiRequests';
import { PublicMerchCollection } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsArrowRight, BsPlus } from 'react-icons/bs';
import style from './style.module.scss';

type FormValues = Omit<MerchCollection, 'collectionPhotos'>;

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: PublicMerchCollection;
  token: string;
}

const CollectionDetailsForm = ({ mode, defaultData, token }: IProps) => {
  const router = useRouter();
  const [lastSaved, setLastSaved] = useState<PublicMerchCollection | null>(defaultData ?? null);
  const initialValues: FormValues = useMemo(
    () => ({
      title: lastSaved?.title ?? '',
      themeColorHex: lastSaved?.themeColorHex ?? style.defaultThemeColorHex,
      description: lastSaved?.description ?? '',
      archived: lastSaved?.archived ?? false,
    }),
    [lastSaved]
  );

  const [photos, setPhotos] = useState<Photo[]>(
    () => lastSaved?.collectionPhotos?.sort((a, b) => a.position - b.position) ?? []
  );
  const [photo, setPhoto] = useState<File | null>(null);

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

    try {
      const uuid = await AdminStoreManager.createNewCollection(
        token,
        {
          ...formData,
          collectionPhotos: [],
        },
        photos.flatMap(photo => (photo.uuid !== undefined ? [] : [photo.blob]))
      );
      showToast('Collection created successfully!', '', [
        {
          text: 'Continue editing',
          onClick: () => router.push(`${config.store.collectionRoute}/${uuid}/edit`),
        },
      ]);
      router.replace(`${config.store.collectionRoute}/${uuid}`);
    } catch (error) {
      reportError('Could not create collection', error);
      setLoading(false);
    }
  };

  const editCollection: SubmitHandler<FormValues> = async formData => {
    if (!lastSaved) {
      return;
    }
    setLoading(true);

    try {
      const { uuid } = lastSaved;
      const collection = await AdminStoreManager.editCollection(
        token,
        uuid,
        lastSaved,
        formData,
        photos.map(photo => (photo.uuid !== undefined ? photo.uuid : photo.blob))
      );
      setLastSaved(collection);
      photos.forEach(photo => {
        if (!photo.uuid) {
          URL.revokeObjectURL(photo.uploadedPhoto);
        }
      });
      setPhotos(collection.collectionPhotos.sort((a, b) => a.position - b.position));
      showToast('Collection details saved!', '', [
        {
          text: 'View public collection page',
          onClick: () => router.push(`${config.store.collectionRoute}/${uuid}`),
        },
      ]);
    } catch (error) {
      reportError('Could not save changes', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCollection = async () => {
    if (!lastSaved) {
      return;
    }
    setLoading(true);

    try {
      await AdminStoreManager.deleteCollection(token, lastSaved.uuid ?? '');
      showToast('Collection deleted successfully');
      router.replace(config.store.homeRoute);
    } catch (error) {
      reportError('Could not delete collection', error);
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(mode === 'edit' ? editCollection : createCollection)}>
        <div className={style.header}>
          <h1>{mode === 'edit' ? 'Modify' : 'Create'} Collection</h1>

          {lastSaved ? (
            <Link
              className={style.viewPage}
              href={`${config.store.collectionRoute}${lastSaved.uuid}`}
            >
              View collection page
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
              placeholder="The Raccoon Collection"
              {...register('title', {
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

          <label htmlFor="themeColorHex">Theme color</label>
          <DetailsFormItem error={errors.themeColorHex?.message}>
            <input
              type="color"
              id="themeColorHex"
              {...register('themeColorHex', {
                required: 'Required',
              })}
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

        <DetailsFormItem error={errors.archived?.message}>
          <label>
            <input type="checkbox" {...register('archived')} />
            &nbsp;Archived?
          </label>
        </DetailsFormItem>

        <div className={style.submitButtons}>
          {mode === 'edit' ? (
            <>
              <Button submit disabled={loading}>
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
              <Button submit disabled={loading}>
                Create collection
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
        maxSize={config.file.MAX_COLLECTION_PHOTO_SIZE_KB * 1024}
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

export default CollectionDetailsForm;
