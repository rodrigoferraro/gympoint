export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  debug: true,
  logger: true,
  tls: {
    secure: false,
    ignoreTLS: true,
    rejectUnauthorized: false,
  },
  auth: {
    user: '38bc7ce5b68802',
    pass: '9bf7485f5727a4',
  },
  default: {
    from: 'Equipe Gympoint <noreply@gympoint.com',
  },
};
