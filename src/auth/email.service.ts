/* eslint-disable prettier/prettier */
import { APP_URL, RESEND_API_KEY } from '@/config';
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h2>Welcome! Please verify your email</h2>
        <p>Click the link below to verify your email address. This link expires in 24 hours.</p>
        <a href='${verificationUrl}'>Verify Email</a>
        <p>If you did not create an account, you can safely ignore this email.</p>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${APP_URL}/api/auth/reset-password?token=${token}`;

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href='${resetUrl}'>Verify Email</a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      `,
    });
  }
}
