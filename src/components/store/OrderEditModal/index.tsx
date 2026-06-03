import { Button, Dropdown, Modal, Typography } from '@/components/common';
import { getItem, orderSwapItem } from '@/lib/api/StoreAPI';
import { UUID } from '@/lib/types';
import {
  PublicMerchItemOption,
  PublicOrderItem,
  PublicOrderWithItems,
} from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

interface OrderEditModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  order: PublicOrderWithItems;
  handleFulfillOrder: (items: PublicOrderItem[]) => Promise<void>;
  handleUnfulfillOrder: (items: PublicOrderItem[]) => Promise<void>;
  onOrderUpdate: (orders: PublicOrderWithItems) => void;
}

export const OrderEditModal = ({
  open,
  onClose,
  onOrderUpdate,
  token,
  order,
  handleFulfillOrder,
  handleUnfulfillOrder,
}: OrderEditModalProps) => {
  const [orderOptions, setOrderOptions] = useState<Record<string, PublicMerchItemOption[]>>({});
  const updateItemVariant = async (item: UUID, newVariant: UUID) => {
    try {
      const newOrder = await orderSwapItem(token, item, newVariant);
      onOrderUpdate(newOrder);
    } catch (error: unknown) {
      reportError(`Failed to swap order`, error);
    }
  };
  // TODO: Find a better way that doesn't involve querying every time the modal opens
  useEffect(() => {
    const fetchItems = async () => {
      const fetched = await Promise.all(
        order.items.map(item => getItem(token, item.option.item.uuid))
      );
      setOrderOptions(
        Object.fromEntries(
          fetched.map(item => [
            item.uuid,
            [...item.options].sort(
              (a, b) => (a.metadata?.position ?? 0) - (b.metadata?.position ?? 0)
            ),
          ])
        )
      );
    };
    fetchItems().catch(e => reportError('Failed to fetch items', e));
  }, [order, token]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography variant="h4/bold">Edit Order</Typography>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <Typography variant="h5/bold">Item Name</Typography>
              </th>
              <th className={styles.actionColumn}>
                <Typography variant="h5/bold">Update Status</Typography>
              </th>
              <th className={styles.actionColumn}>
                <Typography variant="h5/bold">Change Variant</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.uuid}>
                <td>
                  <Typography variant="h5/medium">
                    {item.option.item.itemName ?? item.uuid}
                  </Typography>
                </td>

                <td className={styles.actionColumn}>
                  <div className={styles.buttonContainer}>
                    {item.fulfilled ? (
                      <Button onClick={() => handleUnfulfillOrder([item])} destructive>
                        <Typography variant="h5/bold">Unfulfill</Typography>
                      </Button>
                    ) : (
                      <Button onClick={() => handleFulfillOrder([item])}>
                        <Typography variant="h5/bold">Fulfill</Typography>
                      </Button>
                    )}
                  </div>
                </td>

                <td className={styles.actionColumn}>
                  <Dropdown
                    name="variants"
                    ariaLabel="Change variant of order"
                    readOnly={item.fulfilled}
                    options={(orderOptions[item.option.item.uuid] ?? []).map(variant => ({
                      value: variant.uuid,
                      label: variant.metadata?.value ?? '',
                    }))}
                    value={item.option.uuid}
                    onChange={optionUuid => {
                      updateItemVariant(item.uuid, optionUuid);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default OrderEditModal;
