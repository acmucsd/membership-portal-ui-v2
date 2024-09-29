import { Typography } from '@/components/common';
import { ItemCard } from '@/components/store';
import { PublicMerchItem } from '@/lib/types/apiResponses';
import styles from './style.module.scss';

const dummyItems: PublicMerchItem[] = [
  {
    uuid: '3b5f570a-1ced-4ab2-9e27-db42742e1034',
    itemName: 'ACM Black and Gold Hoodie',
    merchPhotos: [
      {
        uuid: '10ff5d5b-bacd-461f-9502-72bf5c51f28f',
        uploadedPhoto:
          'https://acmucsd.s3.us-west-1.amazonaws.com/portal/merch/3b5f570a-1ced-4ab2-9e27-db42742e1034.JPG',
        uploadedAt: '2023-12-31T20:24:09.910Z',
        position: 0,
      },
    ],
    description: 'Snuggle up for the cold winter months with this ultra soft ACM hoodie',
    options: [
      {
        uuid: '68219211-90d8-4782-b336-61a6ee026d6b',
        price: 15000,
        discountPercentage: 0,
        metadata: {
          type: 'Size',
          value: 'XL',
          position: 3,
        },
        quantity: 0,
      },
    ],
    monthlyLimit: 1,
    lifetimeLimit: 1,
    hidden: false,
    hasVariantsEnabled: true,
  },
  {
    uuid: '44f28b36-7c5a-49da-99b3-e7bb791ae0f7',
    itemName: 'ACM Black and Gold Sweater',
    merchPhotos: [
      {
        uuid: '5b15b2ab-8794-43c1-af3e-907d8fbb6cfa',
        uploadedPhoto:
          'https://acmucsd.s3.us-west-1.amazonaws.com/portal/merch/44f28b36-7c5a-49da-99b3-e7bb791ae0f7.JPG',
        uploadedAt: '2023-12-31T20:24:09.910Z',
        position: 0,
      },
    ],
    description: 'Show your ACM spirit with this soft and trendy sweater that goes with any outfit',
    options: [
      {
        uuid: '680b98ee-4c3d-4d89-986c-54f9d9e3cb63',
        price: 15000,
        discountPercentage: 0,
        metadata: {
          type: 'Size',
          value: 'S',
          position: 0,
        },
        quantity: 0,
      },
    ],
    monthlyLimit: 1,
    lifetimeLimit: 1,
    hidden: false,
    hasVariantsEnabled: true,
  },
  {
    uuid: 'ca167434-7654-4c54-b3c6-28aa518e858c',
    itemName: 'ACM White and Blue Hoodie',
    merchPhotos: [
      {
        uuid: 'b507d6f7-539c-4f67-9f28-c1ae27986c8d',
        uploadedPhoto:
          'https://acmucsd.s3.us-west-1.amazonaws.com/portal/merch/ca167434-7654-4c54-b3c6-28aa518e858c.JPG',
        uploadedAt: '2023-12-31T20:24:09.910Z',
        position: 0,
      },
    ],
    description: 'Prepare for spring with our refreshing and comfy white and blue hoodie!',
    options: [
      {
        uuid: '0436ba65-1822-4f20-981a-fb8297297982',
        price: 15000,
        discountPercentage: 0,
        metadata: {
          type: 'Sizes',
          value: 'M',
          position: 1,
        },
        quantity: 0,
      },
    ],
    monthlyLimit: 1,
    lifetimeLimit: 1,
    hidden: false,
    hasVariantsEnabled: true,
  },
];

const Store = () => {
  return (
    <div className={styles.page}>
      <Typography variant="h3/bold">The Cozy Collection</Typography>
      <Typography variant="h3/regular" component="p">
        Bundle up by the fire with a blanket and this new collection of cute sweaters and hoodies.
      </Typography>
      <div className={styles.items}>
        {dummyItems.map((item, i) => (
          <ItemCard
            images={item.merchPhotos.map(photo => photo.uploadedPhoto)}
            title={item.itemName}
            cost={item.options[0]?.price ?? 0}
            discountPercentage={item.options[0]?.discountPercentage ?? 0}
            className={`${i !== 0 ? styles.desktopOnly : ''}`}
            key={item.uuid}
          />
        ))}
      </div>
    </div>
  );
};

export default Store;
