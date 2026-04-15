const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, fullName, otp) => {
  await transporter.sendMail({
    from: `"Daily News Digest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✅ Your verification code - Daily News Digest',
    html: `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0066ff, #a855f7); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📰 Daily News Digest</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Email Verification</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #e2e8f0;">Hey ${fullName}! 👋</h2>
          <p style="color: #94a3b8; line-height: 1.6;">Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align: center; margin: 35px 0;">
            <div style="display: inline-block; background: #1e293b; border: 2px solid #0066ff; border-radius: 16px; padding: 24px 48px;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Verification Code</p>
              <p style="margin: 0; font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: monospace;">${otp}</p>
            </div>
          </div>
          <p style="color: #64748b; font-size: 13px; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 30px 0;">
          <p style="color: #64748b; font-size: 12px; text-align: center;">© 2026 Daily News Digest. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

const sendPasswordResetEmail = async (email, fullName, otp) => {
  await transporter.sendMail({
    from: `"Daily News Digest" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your password reset code - Daily News Digest',
    html: `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📰 Daily News Digest</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">Password Reset</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #e2e8f0;">Hey ${fullName}! 🔐</h2>
          <p style="color: #94a3b8; line-height: 1.6;">Use the code below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align: center; margin: 35px 0;">
            <div style="display: inline-block; background: #1e293b; border: 2px solid #ef4444; border-radius: 16px; padding: 24px 48px;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Reset Code</p>
              <p style="margin: 0; font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: monospace;">${otp}</p>
            </div>
          </div>
          <p style="color: #64748b; font-size: 13px; text-align: center;">If you didn't request a password reset, ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 30px 0;">
          <p style="color: #64748b; font-size: 12px; text-align: center;">© 2026 Daily News Digest. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };