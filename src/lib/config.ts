const env = process.env.NODE_ENV;
const isDevelopment = env !== 'production';

// added about to save the description somewhere
const config = {
  about: `With 100,000 members and 500+ chapters, the Association for Computing
          Machinery is the world's largest society for computing. Here at UC
          San Diego, our chapter has been established with the mission of
          creating a member-first community devoted to the field of computing.
          We welcome students of all backgrounds and skill levels to come
          develop their skills at our many workshops and form new friendships at
          our many socials. Get involved today by signing up for an event on
          this portal or following us on social media!`,
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
  homeRoute: '/',
  loginRoute: '/login',
  isDevelopment,
};

export default config;
