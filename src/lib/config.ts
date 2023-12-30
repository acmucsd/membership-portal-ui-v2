import Cat from '@/public/assets/graphics/cat404.png';

const env = process.env.NODE_ENV;
const isDevelopment = env !== 'production';

const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_ACM_API_URL || 'https://testing.api.acmucsd.com/api/v2',
    endpoints: {
      user: {
        user: '/user',
        activity: '/user/activity',
        profilepicture: '/user/picture',
        handle: '/user/handle',
      },
      activity: '/activity',
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
      attendance: '/attendance',
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
    },
  },
  defaultEventImage: Cat,
  cssVars: {
    breakpointMd: 768,
  },
  homeRoute: '/',
  loginRoute: '/login',
  leaderboardRoute: '/leaderboard',
  userProfileRoute: '/u/',
  storeRoute: '/store',
  cartRoute: '/store/cart',
  myOrdersRoute: '/store/orders',
  collectionRoute: '/store/collection/',
  itemRoute: '/store/item/',
  admin: {
    homeRoute: '/admin',
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
