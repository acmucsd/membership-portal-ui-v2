import DetailsFormItem from '@/components/admin/DetailsFormItem';
import { Button } from '@/components/common';
import { config, showToast } from '@/lib';
import { AdminStoreManager } from '@/lib/managers';
import { MerchCollection } from '@/lib/types/apiRequests';
import { PublicMerchCollection } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsArrowRight } from 'react-icons/bs';
import style from './style.module.scss';

type FormValues = MerchCollection;

interface IProps {
  mode: 'create' | 'edit';
  defaultData?: Partial<PublicMerchCollection>;
  token: string;
}

const CollectionDetailsForm = ({ mode, defaultData = {}, token }: IProps) => {
  const router = useRouter();
  const initialValues: FormValues = {
    title: defaultData.title ?? '',
    themeColorHex: defaultData.themeColorHex ?? style.defaultThemeColorHex,
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

    try {
      const uuid = await AdminStoreManager.createNewCollection(token, formData);
      showToast('Collection created successfully!', '', [
        {
          text: 'Continue editing',
          onClick: () => router.push(`${config.store.collectionRoute}/${uuid}/edit`), // link to continue editing the item page
        },
      ]);
      router.replace(`${config.store.collectionRoute}/${uuid}`); // change link of page to be view, not new item
    } catch (error) {
      reportError('Could not create collection', error);
      setLoading(false);
    }
  };

  const editCollection: SubmitHandler<FormValues> = async formData => {
    setLoading(true);

    try {
      const uuid = defaultData.uuid ?? '';
      await AdminStoreManager.editCollection(token, uuid, formData);
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
    setLoading(true);

    try {
      await AdminStoreManager.deleteCollection(token, defaultData.uuid ?? '');
      showToast('Collection deleted successfully');
      router.replace(config.store.homeRoute);
    } catch (error) {
      reportError('Could not delete collection', error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(mode === 'edit' ? editCollection : createCollection)}>
      <div className={style.header}>
        <h1>{mode === 'edit' ? 'Modify' : 'Create'} Collection</h1>

        {defaultData.uuid ? (
          <Link
            className={style.viewPage}
            href={`${config.store.collectionRoute}${defaultData.uuid}`}
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
  );
};

export default CollectionDetailsForm;
