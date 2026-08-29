import nodemailer from "nodemailer";
import { config } from "../config/env.js";

class EmailService {
  private transporter: any = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    if (config.smtp.user && config.smtp.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });
    } else {
      console.log("ℹ️ [EmailService] SMTP credentials not configured. Email links will be logged to console in dev mode.");
    }
  }

  public async sendVerificationEmail(toEmail: string, token: string): Promise<boolean> {
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb;">Verify Your VyaparMitra Account</h2>
        <p>Thank you for joining VyaparMitra! Please use the following OTP to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f3f4f6; color: #111827; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 24px; letter-spacing: 4px; border: 1px dashed #d1d5db;">${token}</span>
        </div>
        <p>This OTP will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">If you did not request this email, please ignore it.</p>
      </div>
    `;


    return this.sendMail(toEmail, "Verify Your VyaparMitra Account", html, `Verification OTP: ${token}`);
  }

  public async sendPasswordResetEmail(toEmail: string, token: string): Promise<boolean> {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #dc2626;">Reset Your VyaparMitra Password</h2>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4b5563;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This password reset link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    return this.sendMail(toEmail, "Reset Your VyaparMitra Password", html, `Reset Password Link: ${resetUrl}`);
  }

  private async sendMail(to: string, subject: string, html: string, fallbackConsoleMsg: string): Promise<boolean> {
    if (!this.transporter) {
      console.log(`\n================ [DEVELOPMENT MAIL LOG] ================`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(fallbackConsoleMsg);
      console.log(`=======================================================\n`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: config.smtp.from,
        to,
        subject,
        html,
      });
      console.log(`📧 Email successfully sent to ${to}`);
      return true;
    } catch (err) {
      console.error(`❌ Failed to send email to ${to}:`, err);
      console.log(`[Fallback Link]: ${fallbackConsoleMsg}`);
      return false;
    }
  }
}

export const emailService = new EmailService();
