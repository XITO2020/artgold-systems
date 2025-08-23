import { SendVerificationRequestParams } from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

// Configuration SMTP
const smtpTransport = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

async function sendEmail(to: string, subject: string, html: string, from: string) {
  try {
    await smtpTransport.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
    });
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    return false;
  }
}

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider: { from },
}: SendVerificationRequestParams) {
  const { host } = new URL(url);
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://artgold.com';
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; background-color: #f9fafb; border-radius: 8px;">
      <img src="${siteUrl}/logo.png" alt="ArtGold Logo" style="width: 64px; height: 64px; margin: 0 auto 20px; display: block;" />
      
      <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #4f46e5; text-align: center; margin: 0 0 20px; font-size: 24px;">
          Welcome to ArtGold
        </h1>
        
        <p style="color: #374151; text-align: center; margin: 0 0 24px; line-height: 1.5;">
          You're about to join the ranks of brave creators. Click the button below to verify your email and begin your journey.
        </p>
        
        <a href="${url}" style="display: block; width: 100%; text-align: center; background-color: #4f46e5; color: white; 
          text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;
          margin: 0 auto 24px; max-width: 200px;">
          Verify Email
        </a>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
          Or copy and paste this link into your browser:
        </p>
        <p style="color: #4f46e5; font-size: 14px; word-break: break-all; text-align: center; margin: 8px 0 0;">
          ${url}
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 24px; color: #9ca3af; font-size: 12px;">
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p>&copy; ${new Date().getFullYear()} ArtGold. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await sendEmail(email, "Welcome to ArtGold - Verify Your Email", html, from);
  } catch (error) {
    console.error("Failed to send verification email", error);
    throw new Error("Failed to send verification email");
  }
}
