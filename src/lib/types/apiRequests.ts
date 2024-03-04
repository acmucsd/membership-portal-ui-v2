/* eslint-disable no-use-before-define */
import { URL, UUID } from '.';
import { FeedbackStatus, FeedbackType, SocialMediaType, UserAccessType } from './enums';

// REQUEST TYPES

export interface Pagination {
  offset?: number;
  limit?: number;
}

// AUTH

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordChange {
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  user: PasswordChange;
}

export interface UserRegistration {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  graduationYear: number;
  major: string;
  handle?: string;
}

export interface EmailModificationRequest {
  email: string;
}

export interface RegistrationRequest {
  user: UserRegistration;
}

// USER

export interface Feedback {
  title: string;
  description: string;
  type: FeedbackType;
}

export interface SendPasswordResetEmailRequest {
  email: string;
}

export interface SocialMedia {
  type: SocialMediaType;
  url: URL;
}

export interface PasswordUpdate extends PasswordChange {
  password: string;
}

export interface UserPatches {
  handle?: string;
  firstName?: string;
  lastName?: string;
  major?: string;
  graduationYear?: number;
  bio?: string;
  isAttendancePublic?: boolean;
  passwordChange?: PasswordUpdate;
}

export interface PatchUserRequest {
  user: UserPatches;
}

export interface SubmitFeedbackRequest {
  feedback: Feedback;
}

export interface UpdateFeedbackStatusRequest {
  status: FeedbackStatus;
}

export interface InsertUserSocialMediaRequest {
  socialMedia: SocialMedia;
}

export interface SocialMediaPatches {
  url?: string;
}

export interface UpdateUserSocialMediaRequest {
  socialMedia: SocialMediaPatches;
}

// LEADERBOARD

export interface SlidingLeaderboardQueryParams extends Pagination {
  from?: number;
  to?: number;
}

// ADMIN

export interface Milestone {
  name: string;
  points?: number;
}

export interface CreateMilestoneRequest {
  milestone: Milestone;
}

export interface Bonus {
  description: string;
  users: string[];
  points: number;
}

export interface CreateBonusRequest {
  bonus: Bonus;
}

export interface SubmitAttendanceForUsersRequest {
  users: string[];
  event: UUID;
  asStaff?: boolean;
}

export interface UserAccessUpdates {
  user: string;
  accessType: UserAccessType;
}

export interface ModifyUserAccessLevelRequest {
  accessUpdates: UserAccessUpdates[];
}

// EVENT

export interface OptionalEventProperties {
  organization?: string;
  committee?: string;
  thumbnail?: string;
  eventLink?: string;
  requiresStaff?: boolean;
  staffPointBonus?: number;
}

export interface Event extends OptionalEventProperties {
  cover: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
  attendanceCode: string;
  pointValue: number;
}

export interface GetEventRequest {
  event: UUID;
}

export interface DeleteEventRequest {
  event: UUID;
}

export interface CreateEventRequest {
  event: Event;
}

export interface UploadEventImageRequest {
  cover: File;
}

export interface PatchEventRequest {
  event: Partial<Event>;
}

export interface AttendEventRequest {
  attendanceCode: string;
  asStaff?: boolean;
}

export interface AttendViaExpressCheckinRequest {
  attendanceCode: string;
  email: string;
}

export interface SubmitEventFeedbackRequest {
  feedback: string[];
}

export interface EventSearchOptions {
  offset?: number;
  limit?: number;
  committee?: string;
  reverse?: boolean;
}

// MERCH STORE

export interface CreateMerchCollectionRequest {
  collection: MerchCollection;
}

export interface EditMerchCollectionRequest {
  collection: MerchCollectionEdit;
}

export interface CreateCollectionPhotoRequest {
  position: string;
}

export interface CreateMerchItemRequest {
  merchandise: MerchItem;
}

export interface EditMerchItemRequest {
  merchandise: MerchItemEdit;
}

export interface CreateMerchItemOptionRequest {
  option: MerchItemOption;
}

export interface CreateMerchItemPhotoRequest {
  position: string;
}

export interface PlaceMerchOrderRequest {
  order: MerchItemOptionAndQuantity[];
  pickupEvent: UUID;
}

export interface VerifyMerchOrderRequest {
  order: MerchItemOptionAndQuantity[];
}

export interface FulfillMerchOrderRequest {
  items: OrderItemFulfillmentUpdate[];
}

export interface RescheduleOrderPickupRequest {
  pickupEvent: UUID;
}

export interface CommonCollectionProperties {
  title: string;
  /** 6 digits, starts with `#` */
  themeColorHex?: string;
  description: string;
  archived?: boolean;
}

export interface MerchCollectionPhoto {
  uploadedPhoto: string;
  position: number;
}

export interface MerchCollectionPhotoEdit {
  uuid: string;
  position?: number;
}

export interface MerchCollection extends Partial<CommonCollectionProperties> {
  collectionPhotos: MerchCollectionPhoto[];
}

export interface MerchCollectionEdit extends Partial<CommonCollectionProperties> {
  discountPercentage?: number;
  collectionPhotos?: MerchCollectionPhotoEdit[];
}

export interface CommonMerchItemProperties {
  itemName: string;
  collection: string;
  description: string;
  hidden?: boolean;
  monthlyLimit?: number;
  lifetimeLimit?: number;
  hasVariantsEnabled?: boolean;
}

export interface MerchItemOptionMetadata {
  type: string;
  value: string;
  position: number;
}

export interface MerchItemPhoto {
  uploadedPhoto: string;
  position: number;
}

export interface MerchItemPhotoEdit {
  uuid: string;
  position?: number;
}

export interface MerchItemOption {
  quantity: number;
  price: number;
  discountPercentage?: number;
  metadata?: MerchItemOptionMetadata;
}

export interface MerchItem extends CommonMerchItemProperties {
  options: MerchItemOption[];
  merchPhotos: MerchItemPhoto[];
}

export interface MerchItemOptionEdit {
  uuid: string;
  quantityToAdd?: number;
  price?: number;
  discountPercentage?: number;
  metadata?: MerchItemOptionMetadata;
}

export interface MerchItemEdit extends Partial<CommonMerchItemProperties> {
  options?: MerchItemOptionEdit[];
  merchPhotos?: MerchItemPhotoEdit[];
}

export interface MerchOrderEdit {
  pickupEvent: UUID;
}

export interface OrderItemFulfillmentUpdate {
  uuid: string;
  notes?: string;
}

export interface MerchItemOptionAndQuantity {
  option: string;
  quantity: number;
}

export interface OrderPickupEvent {
  title: string;
  start: Date;
  end: Date;
  description: string;
  orderLimit: number;
  linkedEventUuid?: UUID;
}

export interface OrderPickupEventEdit extends Partial<OrderPickupEvent> {}

export interface CreateOrderPickupEventRequest {
  pickupEvent: OrderPickupEvent;
}

export interface EditOrderPickupEventRequest {
  pickupEvent: OrderPickupEventEdit;
}

export interface GetCartRequest {
  items: string[];
}

// RESUMES
/* Request object does not have nested property because the API request is of
type multipart/form-data which does not support nested properties */
export interface UploadResumeRequest {
  isResumeVisible?: boolean;
}

export interface ResumePatches {
  isResumeVisible?: boolean;
}

export interface PatchResumeRequest {
  resume: ResumePatches;
}

export interface CreateDiscordEventRequest {
  title: string;
  start: string;
  end: string;
  description: string;
  location: string;
  image?: string;
}

export interface GenerateACMURLRequest {
  shortlink: string;
  longlink: string;
}
