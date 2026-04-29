const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const connectDB = require('../config/db');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ─────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      existingUser.verificationToken = otp;
      existingUser.verificationExpires = otpExpires;
      existingUser.password = password;
      existingUser.fullName = fullName;
      await existingUser.save();
    } else {
      await User.create({
        fullName,
        email,
        password,
        verificationToken: otp,
        verificationExpires: otpExpires
      });
    }

    await sendVerificationEmail(email, fullName, otp);

    res.status(201).json({
      message: 'Account created! Check your email for the 6-digit verification code.'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/verify-otp
// ─────────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({
      email,
      verificationToken: otp,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code. Please try again.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/resend-verification
// ─────────────────────────────────────────
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('Verify link error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'No account found with this email.' });
    if (user.isVerified) return res.status(400).json({ message: 'This email is already verified.' });

    const otp = generateOTP();
    user.verificationToken = otp;
    user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.fullName, otp);

    res.json({ message: 'New verification code sent! Please check your inbox.' });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    // Check if database is connected
    if (!connectDB.isConnected()) {
      return res.status(503).json({ 
        message: 'Database temporarily unavailable. Please try again in a moment.' 
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        notVerified: true
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/google
// ─────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        googleId,
        avatar: picture,
        isVerified: true
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.avatar = picture;
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Google authentication failed.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/forgot-password
// ─────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If this email is registered, a reset code has been sent.' });
    }

    const otp = generateOTP();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(email, user.fullName, otp);

    res.json({ message: 'If this email is registered, a reset code has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code. Please try again.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully! You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
