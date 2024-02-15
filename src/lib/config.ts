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
      leaderboard: '/leaderboard',
      store: {
        collection: '/merch/collection',
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
  userProfileRoute: '/u/',
  storeRoute: '/store',
  cartRoute: '/store/cart',
  myOrdersRoute: '/store/orders',
  collectionRoute: '/store/collection/',
  itemRoute: '/store/item/',
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
    store: {
      items: '/admin/store/items',
      pickupEvents: '/admin/store/pickupEvents',
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
  },
};

export default config;
