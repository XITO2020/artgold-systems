import { SendVerificationRequestParams } from 'next-auth/providers/email';
import nodemailer from 'nodemailer';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

// Configuration Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || process.env.EMAIL_SERVER_PASSWORD,
  url: "https://api.mailgun.net",
});

// Configuration SMTP fallback
const smtpTransport = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
});

async function sendWithMailgun(to: string, subject: string, html: string, from: string) {
  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from,
      to,
      subject,
      html,
    });
    console.log('Email sent via Mailgun:', result);
    return result;
  } catch (error) {
    console.error('Mailgun error:', error);
    throw error;
  }
}

async function sendWithSMTP(to: string, subject: string, html: string, from: string) {
  try {
    const result = await smtpTransport.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log('Email sent via SMTP:', result);
    return result;
  } catch (error) {
    console.error('SMTP error:', error);
    throw error;
  }
}

export async function sendVerificationRequest({
  identifier: email,
  url,
  provider: { from },
}: SendVerificationRequestParams) {
  const { host } = new URL(url);
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: sans-serif; background-color: #f9fafb; border-radius: 8px;">
      <img src="${process.env.NEXTAUTH_URL}/logo.png" alt="ArtGold Logo" style="width: 64px; height: 64px; margin: 0 auto 20px; display: block;" />
      
      <div style="background-color: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #4f46e5; text-align: center; margin: 0 0 20px; font-size: 24px;">
          Welcome to ArtGold
        </h1>
        
        <p style="color: #374151; text-align: center; margin: 0 0 24px; line-height: 1.5;">
          You're about to join the ranks of brave creators. Click the button below to verify your email and begin your journey.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" 
             style="display: inline-block;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);">
            Verify Email Address
          </a>
        </div>

        <p style="color: #6b7280; text-align: center; margin: 24px 0 0; font-size: 14px;">
          If you didn't request this email, you can safely ignore it.
        </p>
        
        <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; text-align: center; margin: 0; font-size: 14px;">
            Button not working? Copy and paste this link:<br/>
            <span style="color: #4f46e5; word-break: break-all;">${url}</span>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #9ca3af; font-size: 12px;">
          ArtGold - Where Brave Creators Thrive<br/>
          ${host}
        </p>
      </div>
    </div>
  `;

  try {
    // Essayer d'abord avec Mailgun
    try {
      await sendWithMailgun(email, "Welcome to ArtGold - Verify Your Email", html, from);
      return;
    } catch (mailgunError) {
      console.warn('Mailgun failed, falling back to SMTP:', mailgunError);
    }

    // Fallback sur SMTP si Mailgun échoue
    await sendWithSMTP(email, "Welcome to ArtGold - Verify Your Email", html, from);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
