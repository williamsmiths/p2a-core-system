import { registerAs } from '@nestjs/config';

/**
 * Email/SMTP Configuration
 */
export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: {
    email: process.env.MAIL_FROM,
    name: process.env.MAIL_FROM_NAME || 'P2A ASEAN Platform',
  },
  verificationUrl: process.env.EMAIL_VERIFICATION_URL || 'http://localhost:3000/auth/verify-email',
}));

