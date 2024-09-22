import TempImage from '@/public/assets/graphics/cat404.png';
import Image from 'next/image';
import styles from './style.module.scss';

const Intro = () => {
  return (
    <div className={styles.wrapper}>
      <Image
        src={TempImage}
        alt="temp image"
        width={256}
        height={256}
        className={styles.image}
        style={{ animationDelay: '0.2s' }}
      />
      <Image src={TempImage} alt="temp image" width={256} height={256} className={styles.image} />
      <Image
        src={TempImage}
        alt="temp image"
        width={256}
        height={256}
        className={styles.image}
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
};

export default Intro;
