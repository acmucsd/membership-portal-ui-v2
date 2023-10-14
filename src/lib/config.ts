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
  cssVars: {
    breakpointMd: 768,
  },
  homeRoute: '/',
  loginRoute: '/login',
  leaderboardRoute: '/leaderboard',
  userProfileRoute: '/u/',
  cartRoute: '/store/cart',
  myOrdersRoute: '/store/orders',
  isDevelopment,
};

export default config;
