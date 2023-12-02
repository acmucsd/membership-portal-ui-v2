import Modal from '@/components/common/Modal';
import Image from 'next/image';
import { PointerEvent, useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

const HEIGHT = 200;

type DragState = {
  pointerId: number;
  offsetX: number;
  offsetY: number;
  initLeft: number;
  initTop: number;
};

interface CropperProps {
  file: Blob | null;
  aspectRatio: number;
  circle?: boolean;
  // eslint-disable-next-line no-unused-vars
  onUpload: (file: Blob) => void;
  onCancel: () => void;
}

const Cropper = ({ file, aspectRatio, circle, onUpload, onCancel }: CropperProps) => {
  const WIDTH = HEIGHT * aspectRatio;

  const [url, setUrl] = useState('');
  const image = useRef<HTMLImageElement>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [naturalRatio, setNaturalRatio] = useState(0);
  const [height, setHeight] = useState(0);
  const dragState = useRef<DragState | null>(null);

  useEffect(() => {
    if (!file) {
      return () => {};
    }
    const url = URL.createObjectURL(file);
    setUrl(url);
    setHeight(0);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handlePointerEnd = (e: PointerEvent<HTMLElement>) => {
    if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null;
    }
  };

  return (
    <Modal title="Edit image" open={file !== null} onClose={onCancel}>
      <div
        className={styles.cropWrapper}
        onPointerDown={e => {
          if (!dragState.current) {
            dragState.current = {
              pointerId: e.pointerId,
              offsetX: e.clientX,
              offsetY: e.clientY,
              initLeft: left,
              initTop: top,
            };
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={e => {
          const state = dragState.current;
          if (state?.pointerId === e.pointerId) {
            const left = state.initLeft + e.clientX - state.offsetX;
            const top = state.initTop + e.clientY - state.offsetY;
            setLeft(Math.max(Math.min(left, 0), WIDTH - height * naturalRatio));
            setTop(Math.max(Math.min(top, 0), HEIGHT - height));
          }
        }}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {url && (
          <Image
            src={url}
            alt="Selected file"
            className={styles.image}
            style={{ transform: `translate(${left}px, ${top}px)` }}
            width={naturalRatio * height}
            height={height}
            onLoad={e => {
              if (e.currentTarget.naturalHeight > 0) {
                const ratio = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight;
                setNaturalRatio(ratio);
                const height = Math.max(HEIGHT, WIDTH / ratio);
                const width = height * ratio;
                setHeight(height);
                // Default to centering the image
                setLeft((WIDTH - width) / 2);
                setTop((HEIGHT - height) / 2);
              }
            }}
            ref={image}
          />
        )}
        <div
          className={`${styles.frame} ${circle ? styles.circle : ''}`}
          style={{ aspectRatio: `${aspectRatio}` }}
        />
      </div>
    </Modal>
  );
};

export default Cropper;
