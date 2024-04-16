import { UUID } from '@/lib/types';

export type Photo =
  | { uuid: UUID; uploadedPhoto: string }
  | { uuid?: undefined; blob: Blob; uploadedPhoto: string };
