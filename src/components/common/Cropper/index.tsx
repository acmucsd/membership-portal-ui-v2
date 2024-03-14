import Modal from '@/components/common/Modal';
import { showToast } from '@/lib';
import { useObjectUrl } from '@/lib/utils';
import Image from 'next/image';
import { PointerEvent, useCallback, useRef, useState } from 'react';
import styles from './style.module.scss';

/** Height of the preview square. */
const HEIGHT = 200;

/** Promisified version of `HTMLCanvasElement.toBlob` */
function toBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob | null> {
  return new Promise(resolve => {
    canvas.toBlob(resolve, type, quality);
  });
}

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
  /**
   * Maximum number of bytes (not kilobytes) of the image. If unspecified, there
   * is no limit.
   *
   * The cropper will first try to produce a PNG image then JPG images of
   * decreasing quality until the threshold is met. If a JPG image of 0 quality
   * is still too large, the cropper will close and show an error.
   */
  maxSize?: number;
  onCrop: (file: Blob) => void;
  /**
   * Called when the user cancels cropping or there is an error. `Cropper`
   * automatically shows toasts for errors, so this callback only needs to set
   * the `file` prop to null.
   *
   * When the user successfully crops, only `onCrop` is called and not
   * `onClose`. This way, you can keep the modal open for the user to try again
   * later if uploading the image fails due to RESNET-PROTECTED.
   */
  onClose: () => void;
}

const Cropper = ({
  file,
  aspectRatio,
  circle,
  maxFileHeight,
  maxSize = Infinity,
  onCrop,
  onClose,
}: CropperProps) => {
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
  // onError callback needs to be memoized lest next/image reload the image
  const handleImageError = useCallback(() => {
    if (file !== null) {
      showToast('This image format is not supported.');
      onClose();
    }
  }, [file, onClose]);

  return (
    <Modal title="Edit image" open={loaded === file && file !== null} onClose={onClose}>
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
        {url ? (
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
            onError={handleImageError}
            draggable={false}
            ref={image}
          />
        ) : null}
        <div
          className={`${styles.frame} ${circle ? styles.circle : ''}`}
          style={{ aspectRatio: `${aspectRatio}` }}
        />
      </div>
      <div className={styles.controls}>
        <label className={styles.zoomWrapper}>
          Zoom:&nbsp;
          <input
            type="range"
            className={styles.zoom}
            min={1}
            max={2}
            step="any"
            value={scale}
            onChange={e => {
              const newScale = +e.currentTarget.value;
              const newLeft = WIDTH / 2 - ((WIDTH / 2 - left) / scale) * newScale;
              const newTop = HEIGHT / 2 - ((HEIGHT / 2 - top) / scale) * newScale;
              setScale(newScale);
              setLeft(Math.max(Math.min(newLeft, 0), WIDTH - width * newScale));
              setTop(Math.max(Math.min(newTop, 0), HEIGHT - height * newScale));
            }}
          />
        </label>
        <button
          type="submit"
          className={styles.upload}
          onClick={async () => {
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
            const blob = await toBlob(canvas);
            if (blob && blob.size <= maxSize) {
              onCrop(blob);
              return;
            }
            // Try compressing as JPG with various qualities, in parallel due to
            // eslint(no-await-in-loop)
            const blobs = await Promise.all(
              [1, 0.9, 0.7, 0.4, 0].map(quality => toBlob(canvas, 'image/jpeg', quality))
            );
            const firstSmallEnough = blobs.find(blob => blob && blob.size <= maxSize);
            if (firstSmallEnough) {
              onCrop(firstSmallEnough);
            } else {
              showToast(
                'Your image has too much detail and cannot be compressed.',
                'Try shrinking your image.'
              );
              onClose();
            }
          }}
        >
          Apply
        </button>
      </div>
    </Modal>
  );
};

export default Cropper;
