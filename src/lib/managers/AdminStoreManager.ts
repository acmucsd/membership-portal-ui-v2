import { StoreAPI } from '@/lib/api';
import { UUID } from '@/lib/types';
import {
  MerchCollection,
  MerchItem,
  MerchItemEdit,
  MerchItemOption,
} from '@/lib/types/apiRequests';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';

export const createNewItem = async (
  token: string,
  merchandise: MerchItem,
  merchPhotos: Blob[]
): Promise<UUID | null> => {
  try {
    if (merchandise.monthlyLimit && merchandise.monthlyLimit > (merchandise.lifetimeLimit ?? 0)) {
      throw new Error('Monthly limit cannot exceed lifetime limit.');
    }
    const item = await StoreAPI.createItem(token, merchandise);
    await Promise.all(merchPhotos.map(blob => StoreAPI.createItemPhoto(token, item.uuid, blob)));
    return item.uuid;
  } catch (error) {
    reportError('Could not create item', error);
    return null;
  }
};

export const editItem = async (
  token: string,
  uuid: UUID,
  previousMerchandise: PublicMerchItem,
  merchandise: MerchItemEdit,
  optionType: string,
  options: (MerchItemOption & { uuid?: string; variant: string })[],
  merchPhotos: (string | Blob)[]
): Promise<PublicMerchItem | null> => {
  try {
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
    const newMerchPhotos = await Promise.all(
      merchPhotos.map(async (photo, position) => {
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
        .filter(photo => !newMerchPhotos.some(p => p.uuid === photo.uuid))
        .map(({ uuid }) => StoreAPI.deleteItemPhoto(token, uuid))
    );
    const item = await StoreAPI.editItem(token, uuid, {
      ...merchandise,
      hasVariantsEnabled: options.length > 1,
      options: newOptions,
      merchPhotos: newMerchPhotos,
    });
    return item;
  } catch (error) {
    reportError('Could not save changes', error);
    return null;
  }
};

export const deleteItem = async (token: string, uuid: UUID): Promise<boolean> => {
  try {
    await StoreAPI.deleteItem(token, uuid);
    return true;
  } catch (error) {
    reportError('Could not delete item', error);
    return false;
  }
};

export const createNewCollection = async (
  token: string,
  collection: MerchCollection
): Promise<UUID | null> => {
  try {
    const { uuid } = await StoreAPI.createCollection(token, collection);
    return uuid;
  } catch (error) {
    reportError('Could not create collection', error);
    return null;
  }
};

export const editCollection = async (
  token: string,
  uuid: string,
  collection: MerchCollection
): Promise<boolean> => {
  try {
    await StoreAPI.editCollection(token, uuid, collection);
    return true;
  } catch (error) {
    reportError('Could not save changes', error);
    return false;
  }
};

export const deleteCollection = async (token: string, uuid: UUID): Promise<boolean> => {
  try {
    await StoreAPI.deleteCollection(token, uuid);
    return true;
  } catch (error) {
    reportError('Could not delete collection', error);
    return false;
  }
};
