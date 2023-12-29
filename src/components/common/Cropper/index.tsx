import Modal from '@/components/common/Modal';
import { useObjectUrl } from '@/lib/utils';
import Image from 'next/image';
import { PointerEvent, useRef, useState } from 'react';
import styles from './style.module.scss';

/** Height of the preview square. */
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
  maxFileHeight: number;
  // eslint-disable-next-line no-unused-vars
  onUpload: (file: Blob) => void;
  // eslint-disable-next-line no-unused-vars
  onClose: (reason: 'invalid-image' | null) => void;
}

const Cropper = ({ file, aspectRatio, circle, maxFileHeight, onUpload, onClose }: CropperProps) => {
  const WIDTH = HEIGHT * aspectRatio;

  const url = useObjectUrl(file);
  const image = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(file);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState(1);
  const dragState = useRef<DragState | null>(null);

  const handlePointerEnd = (e: PointerEvent<HTMLElement>) => {
    if (dragState.current?.pointerId === e.pointerId) {
      dragState.current = null;
    }
  };

  return (
    <Modal title="Edit image" open={loaded === file && file !== null} onClose={() => onClose(null)}>
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
            setLeft(Math.max(Math.min(left, 0), WIDTH - width * scale));
            setTop(Math.max(Math.min(top, 0), HEIGHT - height * scale));
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
            width={width * scale}
            height={height * scale}
            onLoad={e => {
              if (e.currentTarget.naturalHeight > 0) {
                const ratio = e.currentTarget.naturalWidth / e.currentTarget.naturalHeight;
                const height = Math.max(HEIGHT, WIDTH / ratio);
                const width = height * ratio;
                setWidth(width);
                setHeight(height);
                // Default to centering the image
                setLeft((WIDTH - width) / 2);
                setTop((HEIGHT - height) / 2);
                setScale(1);
                setLoaded(file);
              }
            }}
            onError={() => {
              if (file !== null) {
                onClose('invalid-image');
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
      <div>
        <label>
          Zoom:{' '}
          <input
            type="range"
            min={1}
            max={2}
            step="any"
            value={scale}
            onChange={e => setScale(+e.currentTarget.value)}
          />
        </label>
        <button
          type="submit"
          onClick={() => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context || !image.current) {
              return;
            }
            const sourceHeight = image.current.naturalHeight * (HEIGHT / (height * scale));
            const fileHeight = Math.min(maxFileHeight, sourceHeight);
            canvas.width = fileHeight * aspectRatio;
            canvas.height = fileHeight;
            context.drawImage(
              image.current,
              image.current.naturalWidth * (-left / (width * scale)),
              image.current.naturalHeight * (-top / (height * scale)),
              sourceHeight * aspectRatio,
              sourceHeight,
              0,
              0,
              fileHeight * aspectRatio,
              fileHeight
            );
            canvas.toBlob(blob => {
              if (blob) {
                onUpload(blob);
              }
            });
          }}
        >
          Upload
        </button>
      </div>
    </Modal>
  );
};

export default Cropper;
