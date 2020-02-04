export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  debug: true,
  logger: true,
  tls: {
    secure: false,
    ignoreTLS: true,
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe Gympoint <noreply@gympoint.com',
  },
};
