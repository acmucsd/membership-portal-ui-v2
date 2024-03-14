import { Button, DRAG_HANDLE, Draggable } from '@/components/common';
import { UUID } from '@/lib/types';
import { BsGripVertical } from 'react-icons/bs';
import style from './style.module.scss';

export type Option = {
  uuid?: UUID;
  price: string;
  quantity: string;
  discountPercentage: string;
  value: string;
};

interface ItemOptionsEditorProps {
  options: Option[];
  onOptions: (options: Option[]) => void;
  optionType: string;
  onOptionType: (optionType: string) => void;
}
const ItemOptionsEditor = ({
  options,
  onOptions,
  optionType,
  onOptionType,
}: ItemOptionsEditorProps) => {
  return (
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
                    onChange={e => onOptionType(e.currentTarget.value)}
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
          <Draggable items={options} onReorder={onOptions}>
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
                          onOptions(
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
                      onOptions(
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
                      onOptions(
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
                      onOptions(
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
                      onClick={() => onOptions(options.filter((_, index) => index !== i))}
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
                  onOptions([
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
  );
};

export default ItemOptionsEditor;
