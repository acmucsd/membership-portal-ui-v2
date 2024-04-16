import { StoreAPI } from '@/lib/api';
import { UUID } from '@/lib/types';
import {
  MerchCollection,
  MerchCollectionEdit,
  MerchItem,
  MerchItemEdit,
  MerchItemOption,
} from '@/lib/types/apiRequests';
import { PublicMerchCollection, PublicMerchItem } from '@/lib/types/apiResponses';

export const createNewItem = async (
  token: string,
  merchandise: MerchItem,
  photos: Blob[]
): Promise<UUID> => {
  if (merchandise.monthlyLimit && merchandise.monthlyLimit > (merchandise.lifetimeLimit ?? 0)) {
    throw new Error('Monthly limit cannot exceed lifetime limit.');
  }
  const item = await StoreAPI.createItem(token, merchandise);
  await Promise.all(photos.map(blob => StoreAPI.createItemPhoto(token, item.uuid, blob)));
  return item.uuid;
};

export const editItem = async (
  token: string,
  uuid: UUID,
  previousMerchandise: PublicMerchItem,
  merchandise: MerchItemEdit,
  optionType: string,
  options: (MerchItemOption & { uuid?: string; variant: string })[],
  photos: (string | Blob)[]
): Promise<PublicMerchItem> => {
  if (merchandise.monthlyLimit && merchandise.monthlyLimit > (merchandise.lifetimeLimit ?? 0)) {
    throw new Error('Monthly limit cannot exceed lifetime limit.');
  }
  // If we need to add new options, ensure that `hasVariantsEnabled` is
  // enabled and update all existing options' `type` so the new options'
  // `type` match.
  if (
    options.length > 1 &&
    options.some(option => !option.uuid) &&
    (!previousMerchandise.hasVariantsEnabled ||
      previousMerchandise.options[0]?.metadata?.type !== optionType)
  ) {
    await StoreAPI.editItem(token, uuid, {
      hasVariantsEnabled: true,
      options: previousMerchandise.options.map(({ uuid, metadata }, position) => ({
        uuid,
        metadata: metadata
          ? { ...metadata, type: optionType }
          : { type: optionType, value: `${position}`, position },
      })),
    });
  }
  // Add new options and photos before deleting old ones because items must
  // have at least one option and photo
  const newOptions = await Promise.all(
    options.map(async (option, position) => {
      const edits = {
        ...option,
        metadata:
          options.length > 1 ? { type: optionType, value: option.variant, position } : undefined,
      };
      const previousQuantity =
        previousMerchandise.options.find(({ uuid }) => uuid === option.uuid)?.quantity ?? 0;
      return option.uuid
        ? {
            uuid: option.uuid,
            ...edits,
            quantityToAdd: edits.quantity - previousQuantity,
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
  const newPhotos = await Promise.all(
    photos.map(async (photo, position) => {
      if (photo instanceof Blob) {
        return { ...(await StoreAPI.createItemPhoto(token, uuid, photo)), position };
      }
      return { uuid: photo, position };
    })
  );
  // Delete removed options and photos
  await Promise.all(
    previousMerchandise.options
      .filter(option => !newOptions.some(o => o.uuid === option.uuid))
      .map(({ uuid }) => StoreAPI.deleteItemOption(token, uuid))
  );
  await Promise.all(
    previousMerchandise.merchPhotos
      .filter(photo => !newPhotos.some(p => p.uuid === photo.uuid))
      .map(({ uuid }) => StoreAPI.deleteItemPhoto(token, uuid))
  );
  const item = await StoreAPI.editItem(token, uuid, {
    ...merchandise,
    hasVariantsEnabled: options.length > 1,
    options: newOptions,
    merchPhotos: newPhotos,
  });
  return item;
};

export const deleteItem = async (token: string, uuid: UUID): Promise<void> => {
  await StoreAPI.deleteItem(token, uuid);
};

export const createNewCollection = async (
  token: string,
  collection: MerchCollection,
  photos: Blob[]
): Promise<UUID | null> => {
  const { uuid } = await StoreAPI.createCollection(token, collection);
  await Promise.all(photos.map(blob => StoreAPI.createCollectionPhoto(token, uuid, blob)));
  return uuid;
};

export const editCollection = async (
  token: string,
  uuid: string,
  previousCollection: PublicMerchCollection,
  collection: MerchCollectionEdit,
  photos: (string | Blob)[]
): Promise<PublicMerchCollection> => {
  const newPhotos = await Promise.all(
    photos.map(async (photo, position) => {
      if (photo instanceof Blob) {
        return { ...(await StoreAPI.createCollectionPhoto(token, uuid, photo)), position };
      }
      return { uuid: photo, position };
    })
  );
  await Promise.all(
    previousCollection.collectionPhotos
      .filter(photo => !newPhotos.some(p => p.uuid === photo.uuid))
      .map(({ uuid }) => StoreAPI.deleteCollectionPhoto(token, uuid))
  );
  return StoreAPI.editCollection(token, uuid, { ...collection, collectionPhotos: newPhotos });
};

export const deleteCollection = async (token: string, uuid: UUID): Promise<void> => {
  await StoreAPI.deleteCollection(token, uuid);
};
