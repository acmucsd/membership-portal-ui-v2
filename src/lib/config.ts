import Cat from '@/public/assets/graphics/cat404.png';

const isDevelopment = process.env.NEXT_PUBLIC_PRODUCTION === undefined;

const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_ACM_API_URL || 'https://testing.api.acmucsd.com/api/v2',
    endpoints: {
      user: {
        user: '/user',
        activity: '/user/activity',
        profilepicture: '/user/picture',
        handle: '/user/handle',
        socialMedia: '/user/socialMedia',
      },
      activity: '/activity',
      resume: '/resume',
      auth: {
        register: '/auth/registration',
        login: '/auth/login',
        resetPassword: '/auth/passwordReset',
        emailVerification: '/auth/emailVerification',
        emailModification: '/auth/emailModification',
      },
      admin: {
        attendance: '/admin/attendance',
        bonus: '/admin/bonus',
        emails: '/admin/email',
        access: '/admin/access',
      },
      event: {
        event: '/event',
        past: '/event/past',
        future: '/event/future',
        picture: '/event/picture',
      },
      attendance: {
        attendance: '/attendance',
        forUserByUUID: '/attendance/user',
      },
      feedback: '/feedback',
      leaderboard: '/leaderboard',
      store: {
        collection: '/merch/collection',
        collectionPicture: '/merch/collection/picture',
        item: '/merch/item',
        itemPicture: '/merch/item/picture',
        option: '/merch/option',
        verification: '/merch/order/verification',
        order: '/merch/order',
        orders: '/merch/orders',
        pickup: {
          future: '/merch/order/pickup/future',
          past: '/merch/order/pickup/past',
          single: '/merch/order/pickup',
          cleanup: '/merch/order/cleanup',
        },
      },
    },
  },
  klefki: {
    baseUrl: process.env.NEXT_PUBLIC_KLEFKI_API_URL ?? '',
    key: process.env.NEXT_PUBLIC_TOTP_KEY ?? '',
    endpoints: {
      notion: {
        page: '/notion/page/',
        events: '/notion/events/upcoming',
      },
      discord: {
        event: '/discord/event',
      },
      acmurl: {
        generate: '/acmurl/generate',
      },
    },
  },
  defaultEventImage: Cat,
  cssVars: {
    breakpointMd: 768,
  },
  homeRoute: '/',
  eventsRoute: '/events',
  loginRoute: '/login',
  logoutRoute: '/logout',
  leaderboardRoute: '/leaderboard',
  profileRoute: '/profile',
  aboutRoute: '/about',
  feedbackRoute: '/feedback',
  userProfileRoute: '/u/',
  store: {
    homeRoute: '/store',
    cartRoute: '/store/cart',
    myOrdersRoute: '/store/orders',
    collectionRoute: '/store/collection/',
    createCollectionRoute: '/store/collection/new',
    itemRoute: '/store/item/',
    createItemRoute: '/store/item/new',
  },
  profile: {
    route: '/profile',
    editRoute: '/profile/edit',
  },
  admin: {
    homeRoute: '/admin',
    awardPoints: '/admin/points',
    grantPastAttendance: '/admin/attendance',
    awardMilestone: '/admin/milestone',
    viewResumes: '/admin/resumes',
    manageUserAccess: '/admin/manage-user-access',
    store: {
      items: '/admin/store/items',
      pickup: '/admin/store/pickup',
      pickupCreate: '/admin/store/pickup/create',
      pickupEdit: '/admin/store/pickup/edit',
      homeRoute: '/admin/store',
    },
    events: {
      homeRoute: '/admin/event',
      editRoute: '/admin/event/edit',
      createRoute: '/admin/event/create',
    },
  },
  isDevelopment,
  file: {
    MAX_EVENT_COVER_SIZE_KB: isDevelopment ? 256 : 2048,
    MAX_PROFILE_PICTURE_SIZE_KB: 256,
    MAX_BANNER_SIZE_KB: isDevelopment ? 256 : 2048,
    MAX_MERCH_PHOTO_SIZE_KB: 1024,
    MAX_COLLECTION_PHOTO_SIZE_KB: 1024,
    MAX_RESUME_SIZE_KB: isDevelopment ? 256 : 2048,
  },
};

export default config;
