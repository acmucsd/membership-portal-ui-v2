import { MerchItemOptionMetadata, URL, UUID } from '.';
import {
  ActivityScope,
  ActivityType,
  FeedbackStatus,
  FeedbackType,
  OrderPickupEventStatus,
  UserAccessType,
  UserState,
} from './enums';

// RESPONSE TYPES

export interface ValidatorError {
  children: ValidatorError[];
  constraints: object;
  property: string;
  target: object;
}

export interface CustomErrorBody {
  name: string;
  message: string;
  httpCode: number;
  stack?: string;
  errors?: ValidatorError[];
}

export interface ApiResponse {
  error: CustomErrorBody;
}

// ADMIN

export interface CreateMilestoneResponse extends ApiResponse {}

export interface CreateBonusResponse extends ApiResponse {
  emails: string[];
}

export interface UploadBannerResponse extends ApiResponse {
  banner: string;
}

export interface GetAllEmailsResponse extends ApiResponse {
  emails: string[];
}

export interface SubmitAttendanceForUsersResponse extends ApiResponse {
  attendances: PublicAttendance[];
}

// ATTENDANCE

export interface PublicAttendance {
  user: PublicProfile;
  event: PublicEvent;
  timestamp: Date;
  asStaff: boolean;
  feedback: string[];
}

export interface GetAttendancesForEventResponse extends ApiResponse {
  attendances: PublicAttendance[];
}

export interface GetAttendancesForUserResponse extends ApiResponse {
  attendances: PublicAttendance[];
}

export interface AttendEventResponse extends ApiResponse {
  event: PublicEvent;
}

// AUTH

export interface RegistrationResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface LoginResponse extends ApiResponse {
  token: string;
}

export interface ResendEmailVerificationResponse extends ApiResponse {}

export interface VerifyEmailResponse extends ApiResponse {}

export interface EmailModificationResponse extends ApiResponse {}

export interface SendPasswordResetEmailResponse extends ApiResponse {}

export interface ResetPasswordResponse extends ApiResponse {}

export interface VerifyAuthTokenResponse extends ApiResponse {
  authenticated: boolean;
}

// EVENT

export interface PublicEvent {
  uuid: UUID;
  organization: string;
  committee: string;
  thumbnail: string;
  cover: string;
  title: string;
  description: string;
  location: string;
  eventLink: string;
  start: string;
  end: string;
  attendanceCode?: string;
  pointValue: number;
  requiresStaff: boolean;
  staffPointBonus: number;
}

export interface GetPastEventsResponse extends ApiResponse {
  events: PublicEvent[];
}

export interface GetFutureEventsResponse extends ApiResponse {
  events: PublicEvent[];
}

export interface UpdateEventCoverResponse extends ApiResponse {
  event: PublicEvent;
}

export interface GetOneEventResponse extends ApiResponse {
  event: PublicEvent;
}

export interface PatchEventResponse extends ApiResponse {
  event: PublicEvent;
}

export interface DeleteEventResponse extends ApiResponse {}

export interface GetAllEventsResponse extends ApiResponse {
  events: PublicEvent[];
}

export interface CreateEventResponse extends ApiResponse {
  event: PublicEvent;
}

// LEADERBOARD

export interface GetLeaderboardResponse extends ApiResponse {
  leaderboard: PublicProfile[];
}

// MERCH STORE

export interface PublicMerchCollection {
  uuid: UUID;
  title: string;
  themeColorHex?: string;
  description: string;
  items: PublicMerchItem[];
  createdAt: Date;
}

export interface PublicMerchItem {
  uuid: UUID;
  itemName: string;
  collection?: PublicMerchCollection;
  picture: string | null;
  description: string;
  monthlyLimit: number;
  lifetimeLimit: number;
  hidden: boolean;
  hasVariantsEnabled: boolean;
  options: PublicMerchItemOption[];
}

export interface PublicMerchItemWithPurchaseLimits extends PublicMerchItem {
  monthlyRemaining: number;
  lifetimeRemaining: number;
}

export interface PublicCartMerchItem {
  uuid: UUID;
  itemName: string;
  picture: string;
  description: string;
}

export interface PublicMerchItemOption {
  uuid: UUID;
  price: number;
  quantity: number;
  discountPercentage: number;
  metadata: MerchItemOptionMetadata;
}

export interface PublicOrderMerchItemOption {
  uuid: UUID;
  price: number;
  discountPercentage: number;
  metadata: MerchItemOptionMetadata;
  item: PublicCartMerchItem;
}

export interface PublicOrderItem {
  uuid: UUID;
  option: PublicOrderMerchItemOption;
  salePriceAtPurchase: number;
  discountPercentageAtPurchase: number;
  fulfilled: boolean;
  fulfilledAt?: Date;
  notes?: string;
}

export interface PublicOrder {
  uuid: UUID;
  user: PublicProfile;
  totalCost: number;
  status: string;
  orderedAt: Date;
  pickupEvent: PublicOrderPickupEvent;
}

export interface PublicOrderWithItems extends PublicOrder {
  items: PublicOrderItem[];
}

export interface GetOneMerchCollectionResponse extends ApiResponse {
  collection: PublicMerchCollection;
}

export interface GetAllMerchCollectionsResponse extends ApiResponse {
  collections: PublicMerchCollection[];
}

export interface CreateMerchCollectionResponse extends ApiResponse {
  collection: PublicMerchCollection;
}

export interface EditMerchCollectionResponse extends ApiResponse {
  collection: PublicMerchCollection;
}

export interface DeleteMerchCollectionResponse extends ApiResponse {}

export interface GetOneMerchItemResponse extends ApiResponse {
  item: PublicMerchItemWithPurchaseLimits;
}

export interface CreateMerchItemResponse extends ApiResponse {
  item: PublicMerchItem;
}

export interface EditMerchItemResponse extends ApiResponse {
  item: PublicMerchItem;
}

export interface DeleteMerchItemResponse extends ApiResponse {}

export interface UpdateMerchPhotoResponse extends ApiResponse {
  item: PublicMerchItem;
}

export interface CreateMerchItemOptionResponse extends ApiResponse {
  option: PublicMerchItemOption;
}

export interface DeleteMerchItemOptionResponse extends ApiResponse {}

export interface GetOneMerchOrderResponse extends ApiResponse {
  order: PublicOrderWithItems;
}

export interface GetMerchOrdersResponse extends ApiResponse {
  orders: PublicOrder[];
}

export interface PlaceMerchOrderResponse extends ApiResponse {
  order: PublicOrderWithItems;
}

export interface VerifyMerchOrderResponse extends ApiResponse {}

export interface EditMerchOrderResponse extends ApiResponse {}

export interface GetCartResponse extends ApiResponse {
  cart: PublicOrderMerchItemOption[];
}
export interface FulfillMerchOrderResponse extends ApiResponse {
  order: PublicOrder;
}

// USER

export interface PublicActivity {
  type: ActivityType;
  scope: ActivityScope;
  description: string;
  pointsEarned: number;
  timestamp: Date;
}

export interface PublicProfile {
  uuid: UUID;
  handle: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  graduationYear: number;
  major: string;
  bio: string;
  points: number;
}

export interface PrivateProfile extends PublicProfile {
  email: string;
  accessType: UserAccessType;
  state: UserState;
  credits: number;
}

export interface PublicFeedback {
  uuid: UUID;
  user: PublicProfile;
  title: string;
  description: string;
  timestamp: Date;
  status: FeedbackStatus;
  type: FeedbackType;
}

export interface GetUserActivityStreamResponse extends ApiResponse {
  activity: PublicActivity[];
}

export interface UpdateProfilePictureResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface UpdateResumeResponse extends ApiResponse {
  resume: PublicResume;
}

export interface GetUserResponse extends ApiResponse {
  user: PrivateProfile | PublicProfile;
}

export interface GetCurrentUserResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface PatchUserResponse extends ApiResponse {
  user: PrivateProfile;
}

export interface GetFeedbackResponse extends ApiResponse {
  feedback: PublicFeedback[];
}

export interface SubmitFeedbackResponse extends ApiResponse {
  feedback: PublicFeedback;
}

export interface UpdateFeedbackStatusResponse extends ApiResponse {
  feedback: PublicFeedback;
}

export interface PublicOrderPickupEvent {
  uuid: UUID;
  title: string;
  start: Date;
  end: Date;
  description: string;
  orders?: PublicOrderWithItems[];
  orderLimit?: number;
  status: OrderPickupEventStatus;
}

export interface GetOrderPickupEventsResponse extends ApiResponse {
  pickupEvents: PublicOrderPickupEvent[];
}

export interface GetOrderPickupEventResponse extends ApiResponse {
  pickupEvent: PublicOrderPickupEvent;
}

export interface CreateOrderPickupEventResponse extends ApiResponse {
  pickupEvent: PublicOrderPickupEvent;
}

export interface EditOrderPickupEventResponse extends ApiResponse {
  pickupEvent: PublicOrderPickupEvent;
}

export interface DeleteOrderPickupEventResponse extends ApiResponse {}

export interface CancelOrderPickupEventResponse extends ApiResponse {}

export interface CompleteOrderPickupEventResponse extends ApiResponse {
  orders: PublicOrder[];
}

export interface CancelAllPendingOrdersResponse extends ApiResponse {}

export interface PublicResume {
  uuid: UUID;
  user: UUID;
  isResumeVisible: boolean;
  url: string;
  lastUpdated: Date;
}

export interface PatchResumeResponse extends ApiResponse {
  resume: PublicResume;
}

export interface NotionEventDetails {
  title: string;
  organization: string[];
  location: string;
  description: string;
  checkin: string;
  start: string;
  end: string;
  acmurl: string;
}

export interface NotionEventPreview {
  title: string;
  date: {
    start: string;
    end: string;
  };
  url: URL;
}
