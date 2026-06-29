import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to send mail
const sendMail = async (to: string, subject: string, html: string) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not set. Skipping email send.');
      return;
    }
    const info = await transporter.sendMail({
      from: `"Scheduler" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Failed to send email', error);
  }
};

// 1. Welcome Email
export const sendWelcomeEmail = async (to: string, userName: string) => {
  const subject = 'Welcome to Scheduler! 🚀';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
      <div style="background-color: #ef4444; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Scheduler!</h1>
      </div>
      <div style="padding: 32px; color: #334155; line-height: 1.6;">
        <h2 style="margin-top: 0; color: #1e293b;">Hi ${userName},</h2>
        <p>Thank you for signing up for Scheduler. We're thrilled to have you on board!</p>
        <p>With Scheduler, you can:</p>
        <ul style="padding-left: 20px;">
          <li>Draft posts with our <strong>Advanced AI Composer</strong>.</li>
          <li>Schedule posts to multiple platforms at once.</li>
          <li>Track your social performance directly on your dashboard.</li>
        </ul>
        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:5173/dashboard" style="background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
        <p>If you have any questions, feel free to reply to this email.</p>
        <p style="margin-bottom: 0;">Cheers,<br/>The Scheduler Team</p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9;">
        © 2026 Scheduler. All rights reserved.
      </div>
    </div>
  `;
  await sendMail(to, subject, html);
};

// 2. Post Scheduled Email
export const sendPostScheduledEmail = async (to: string, userName: string, postDetails: { content: string, platforms: string[], scheduledFor: string, mediaUrl?: string }) => {
  const subject = 'Your post has been scheduled! 📅';
  const dateStr = new Date(postDetails.scheduledFor).toLocaleString();
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
      <div style="background-color: #ef4444; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Post Scheduled Successfully!</h1>
      </div>
      <div style="padding: 32px; color: #334155; line-height: 1.6;">
        <h2 style="margin-top: 0; color: #1e293b;">Hi ${userName},</h2>
        <p>Your new post has been added to the queue and is set to publish.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">POST DETAILS</h3>
          <p style="font-style: italic; color: #475569;">"${postDetails.content}"</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 16px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 120px;">Platforms:</td>
              <td style="padding: 6px 0; color: #334155; text-transform: capitalize;">${postDetails.platforms.join(', ')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Scheduled For:</td>
              <td style="padding: 6px 0; color: #334155;">${dateStr}</td>
            </tr>
          </table>
          ${postDetails.mediaUrl ? `
            <div style="margin-top: 16px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
              <img src="${postDetails.mediaUrl}" alt="Media Preview" style="width: 100%; max-height: 250px; object-fit: cover; display: block;" />
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:5173/scheduler" style="background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View in Scheduler</a>
        </div>
        <p style="margin-bottom: 0;">Cheers,<br/>The Scheduler Team</p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9;">
        © 2026 Scheduler. All rights reserved.
      </div>
    </div>
  `;
  await sendMail(to, subject, html);
};

// 3. Account Connected Email
export const sendAccountConnectedEmail = async (to: string, userName: string, accountDetails: { name: string, platform: string }) => {
  const subject = 'New social profile connected! 🔗';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
      <div style="background-color: #ef4444; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Social Account Linked!</h1>
      </div>
      <div style="padding: 32px; color: #334155; line-height: 1.6;">
        <h2 style="margin-top: 0; color: #1e293b;">Hi ${userName},</h2>
        <p>A new social media profile has been successfully connected to your Scheduler account.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 120px;">Account Name:</td>
              <td style="padding: 6px 0; color: #334155;">${accountDetails.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Platform:</td>
              <td style="padding: 6px 0; color: #334155; text-transform: capitalize;">${accountDetails.platform}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Status:</td>
              <td style="padding: 6px 0; color: #22c55e; font-weight: bold;">Active</td>
            </tr>
          </table>
        </div>

        <p>You can now schedule and publish posts to this profile directly from the app.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:5173/dashboard" style="background-color: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
        <p style="margin-bottom: 0;">Cheers,<br/>The Scheduler Team</p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9;">
        © 2026 Scheduler. All rights reserved.
      </div>
    </div>
  `;
  await sendMail(to, subject, html);
};

// 4. Post Published Email
export const sendPostPublishedEmail = async (to: string, userName: string, postDetails: { content: string, platforms: string[], mediaUrl?: string }) => {
  const subject = 'Your post has been published! 🎉';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
      <div style="background-color: #22c55e; padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Post Published Successfully!</h1>
      </div>
      <div style="padding: 32px; color: #334155; line-height: 1.6;">
        <h2 style="margin-top: 0; color: #1e293b;">Hi ${userName},</h2>
        <p>Great news! Your scheduled post has been successfully published to your connected social profiles.</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">PUBLISHED POST</h3>
          <p style="color: #334155; font-size: 14px; line-height: 1.5; font-style: italic;">"${postDetails.content}"</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 16px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold; width: 120px;">Platforms:</td>
              <td style="padding: 6px 0; color: #334155; text-transform: capitalize;">${postDetails.platforms.join(', ')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: bold;">Status:</td>
              <td style="padding: 6px 0; color: #22c55e; font-weight: bold;">Live</td>
            </tr>
          </table>
          ${postDetails.mediaUrl ? `
            <div style="margin-top: 16px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
              <img src="${postDetails.mediaUrl}" alt="Published Media" style="width: 100%; max-height: 250px; object-fit: cover; display: block;" />
            </div>
          ` : ''}
        </div>

        <p>Check the live performance of your post on your dashboard.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:5173/dashboard" style="background-color: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
        <p style="margin-bottom: 0;">Cheers,<br/>The Scheduler Team</p>
      </div>
      <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9;">
        © 2026 Scheduler. All rights reserved.
      </div>
    </div>
  `;
  await sendMail(to, subject, html);
};
