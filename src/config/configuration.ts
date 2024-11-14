export default () => {
  return {
    env: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || '0.0.0.0',
    database: {
      client: process.env.DATABASE_CLIENT,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD || '',
      name: process.env.DATABASE_NAME,
    },
    jwt: {
      secret: process.env.JWT_SECRET || ''
    },
    area: {
      url: process.env.AREA_URL || '',
    },
    biteship: {
      url: process.env.BITESHIP_URL || '',
      secret: process.env.BITESHIP_SECRET || ''
    },
    midtrans: {
      client: process.env.MIDTRANS_CLIENT || '',
      server: process.env.MIDTRANS_SERVER || ''
    },
    MAIL_HOST: process.env.MAIL_HOST || '',
    MAIL_PORT: process.env.MAIL_PORT || '',
    MAIL_USER: process.env.MAIL_USER || '',
    MAIL_PASSWORD: process.env.MAIL_PASSWORD || '',
  };
};
