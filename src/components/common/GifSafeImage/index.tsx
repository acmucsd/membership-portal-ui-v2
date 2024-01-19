import { isSrcAGif } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';

/**
 * A next/image Image that is automatically unoptimized when `src` is a gif
 * @param props - props for Next Image component
 * @returns image component
 */
const GifSafeImage = ({ src, alt, ...restProps }: ImageProps) => {
  return <Image src={src} alt={alt} unoptimized={isSrcAGif(src)} {...restProps} />;
};

export default GifSafeImage;
