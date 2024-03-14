import { HTMLAttributes, PointerEvent, ReactNode, useRef, useState } from 'react';
import styles from './style.module.scss';

export const DRAG_HANDLE = styles.dragHandle;

interface ElementPosition {
  element: HTMLElement;
  left: number;
  top: number;
  ogIndex: number;
}
const getPosition = (element: HTMLElement, index: number): ElementPosition => {
  const { left, top } = element.getBoundingClientRect();
  return { element, left, top, ogIndex: index };
};

interface DragState {
  pointerId: number;
  elements: ElementPosition[];
  reordered: ElementPosition[];
  dragged: ElementPosition;
  initMouseX: number;
  initMouseY: number;
  newLeft: number;
  newTop: number;
}

interface DraggableProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  children: (props: HTMLAttributes<Element>, item: T, index: number) => ReactNode;
}
function Draggable<T>({ items, onReorder, children: mapFn }: DraggableProps<T>) {
  const [dragging, setDragging] = useState(-1);
  const dragState = useRef<DragState | null>(null);

  const getProps = (index: number): HTMLAttributes<HTMLElement> => {
    const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
      if (
        dragState.current === null &&
        e.target instanceof Element &&
        e.target.closest(`.${DRAG_HANDLE}`)
      ) {
        const elements = Array.from(e.currentTarget.parentElement?.children ?? [])
          .filter(
            (child): child is HTMLElement =>
              child instanceof HTMLElement && child.classList.contains(styles.dragItem)
          )
          .map(getPosition);
        const dragged = getPosition(e.currentTarget, index);
        dragState.current = {
          pointerId: e.pointerId,
          elements,
          reordered: elements,
          dragged,
          initMouseX: e.clientX,
          initMouseY: e.clientY,
          newLeft: dragged.left,
          newTop: dragged.top,
        };
        e.target.setPointerCapture(e.pointerId);
        setDragging(index);
      }
    };
    const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
      if (e.pointerId === dragState.current?.pointerId) {
        const { elements, dragged, initMouseX, initMouseY } = dragState.current;

        e.currentTarget.style.transform = `translate(${e.clientX - initMouseX}px,${
          e.clientY - initMouseY
        }px)`;
        const newLeft = e.clientX - initMouseX + dragged.left;
        const newTop = e.clientY - initMouseY + dragged.top;
        dragState.current.newLeft = newLeft;
        dragState.current.newTop = newTop;

        const { index: closest } = elements.reduce(
          (acc, { left, top }, i) => {
            const distance = (newLeft - left) ** 2 + (newTop - top) ** 2;
            return distance < acc.minDist ? { minDist: distance, index: i } : acc;
          },
          { minDist: Infinity, index: -1 }
        );

        dragState.current.reordered = [...elements];
        dragState.current.reordered.splice(index, 1);
        dragState.current.reordered.splice(closest, 0, dragged);
        dragState.current.reordered.forEach((item, newIndex) => {
          const newItem = elements[newIndex];
          if (item.ogIndex === index || !newItem) {
            return;
          }
          const { element, left, top } = item;
          element.style.transform = `translate(${newItem.left - left}px, ${newItem.top - top}px)`;
        });
      }
    };
    const handlePointerEnd = (e: PointerEvent<HTMLElement>) => {
      if (e.pointerId === dragState.current?.pointerId) {
        const { elements, reordered, newLeft, newTop } = dragState.current;
        elements.forEach(item => {
          const { element } = item;
          element.style.transition = 'none';
          element.style.transform = '';
        });
        // Pause transitions and try to preserve dragged element's visual position
        const targetPosition = elements[reordered.findIndex(item => item.ogIndex === index)];
        const draggedElement = e.currentTarget;
        draggedElement.style.transform = `translate(${newLeft - (targetPosition?.left ?? 0)}px, ${
          newTop - (targetPosition?.top ?? 0)
        }px)`;
        window.requestAnimationFrame(() => {
          // Resume transitions and let the element slide into place
          elements.forEach(item => {
            const { element } = item;
            element.style.transition = '';
            element.style.transform = '';
          });
        });
        dragState.current = null;
        setDragging(-1);
        onReorder(
          reordered.flatMap(({ ogIndex }) => {
            const item = items[ogIndex];
            return item ? [item] : [];
          })
        );
      }
    };

    return {
      className: `${styles.dragItem} ${dragging === index ? styles.dragging : ''}`,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    };
  };

  return <>{items.map((item, index) => mapFn(getProps(index), item, index))}</>;
}

export default Draggable;
