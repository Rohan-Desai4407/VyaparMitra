import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { User, IUser } from "../models/User.js";
import { config } from "../config/env.js";
import { emailService } from "./email.service.js";

// Memory storage fallback if MongoDB is not running
const inMemoryUsers: Map<string, any> = new Map();
const googleClient = new OAuth2Client(config.googleClientId);

export const authService = {
  async register(name: string, email: string, password: string, preferredLanguage: string = "en") {
    const existingUser = await User.findOne({ email }).catch(() => inMemoryUsers.get(email));
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    let newUser: any;

    try {
      newUser = await User.create({
        name,
        email,
        passwordHash,
        preferredLanguage,
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
      });
    } catch (dbErr) {
      // Memory fallback
      const mockUser = {
        _id: "user_" + Date.now(),
        name,
        email,
        passwordHash,
        preferredLanguage,
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
        createdAt: new Date(),
      };
      inMemoryUsers.set(email, mockUser);
      newUser = mockUser;
    }

    // Send verification email asynchronously
    await emailService.sendVerificationEmail(email, verificationToken);

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, config.jwtSecret, { expiresIn: "7d" });
    return {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        preferredLanguage: newUser.preferredLanguage,
        isVerified: newUser.isVerified,
      },
      token,
      message: "Registration successful. Please check your email to verify your account.",
    };
  },

  async googleLogin(credentialToken: string) {
    let googleUserEmail: string;
    let googleUserName: string;
    let googleId: string;
    let picture: string | undefined;

    try {
      if (config.googleClientId && config.googleClientId !== "your_google_client_id.apps.googleusercontent.com") {
        const ticket = await googleClient.verifyIdToken({
          idToken: credentialToken,
          audience: config.googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
          throw new Error("Invalid Google ID token payload.");
        }
        googleUserEmail = payload.email;
        googleUserName = payload.name || "Google User";
        googleId = payload.sub;
        picture = payload.picture;
      } else {
        // Fallback token decoding for development / unconfigured Client ID
        const decoded: any = jwt.decode(credentialToken);
        if (decoded && decoded.email) {
          googleUserEmail = decoded.email;
          googleUserName = decoded.name || "Google User";
          googleId = decoded.sub || "google_" + Date.now();
          picture = decoded.picture;
        } else {
          throw new Error("Invalid Google credential format.");
        }
      }
    } catch (err: any) {
      throw new Error(`Google authentication failed: ${err.message}`);
    }

    let user: any = await User.findOne({ email: googleUserEmail }).catch(() => inMemoryUsers.get(googleUserEmail));

    if (!user) {
      try {
        user = await User.create({
          name: googleUserName,
          email: googleUserEmail,
          passwordHash: "",
          isVerified: true, // Google accounts are pre-verified
          googleId,
          picture,
        });
      } catch (dbErr) {
        user = {
          _id: "google_user_" + Date.now(),
          name: googleUserName,
          email: googleUserEmail,
          passwordHash: "",
          isVerified: true,
          googleId,
          picture,
          createdAt: new Date(),
        };
        inMemoryUsers.set(googleUserEmail, user);
      }
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        if (picture) user.picture = picture;
        if (typeof user.save === "function") {
          await user.save();
        }
      }
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, config.jwtSecret, { expiresIn: "7d" });
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isVerified: true,
      },
      token,
      message: "Successfully authenticated with Google",
    };
  },

  async verifyEmail(token: string) {
    let user: any = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    }).catch(() => null);

    if (!user) {
      const allUsers = Array.from(inMemoryUsers.values());
      for (const u of allUsers) {
        if (
          u.verificationToken === token &&
          u.verificationTokenExpires &&
          u.verificationTokenExpires > new Date()
        ) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      throw new Error("Invalid or expired email verification token.");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    if (typeof user.save === "function") {
      await user.save();
    }

    return { message: "Email verified successfully! You can now log in." };
  },

  async resendVerification(email: string) {
    let user: any = await User.findOne({ email }).catch(() => inMemoryUsers.get(email));
    if (!user) {
      throw new Error("No user found with this email address.");
    }

    if (user.isVerified) {
      throw new Error("This account is already verified.");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    if (typeof user.save === "function") {
      await user.save();
    }

    await emailService.sendVerificationEmail(email, verificationToken);
    return { message: "Verification email resent successfully." };
  },

  async login(email: string, password: string) {
    let user: any = await User.findOne({ email }).catch(() => inMemoryUsers.get(email));
    if (!user) {
      user = inMemoryUsers.get(email);
    }

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, config.jwtSecret, { expiresIn: "7d" });
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        isVerified: user.isVerified ?? false,
      },
      token,
    };
  },

  async forgotPassword(email: string) {
    let user: any = await User.findOne({ email }).catch(() => inMemoryUsers.get(email));
    if (!user) {
      return { message: "If an account with that email exists, password reset instructions have been sent." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;

    if (typeof user.save === "function") {
      await user.save();
    }

    await emailService.sendPasswordResetEmail(email, resetToken);
    return { message: "If an account with that email exists, password reset instructions have been sent." };
  },

  async resetPassword(token: string, newPassword: string) {
    let user: any = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).catch(() => null);

    if (!user) {
      const allUsers = Array.from(inMemoryUsers.values());
      for (const u of allUsers) {
        if (
          u.resetPasswordToken === token &&
          u.resetPasswordExpires &&
          u.resetPasswordExpires > new Date()
        ) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      throw new Error("Invalid or expired password reset token.");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    if (typeof user.save === "function") {
      await user.save();
    }

    return { message: "Password updated successfully. You can now log in with your new password." };
  },

  async getProfile(userId: string) {
    const user: any = await User.findById(userId).catch(() => null);
    if (user) {
      return { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, isVerified: user.isVerified, picture: user.picture };
    }
    return { id: userId, name: "Demo Entrepreneur", email: "user@vyaparmitra.in", preferredLanguage: "en", isVerified: true };
  },

  async updateProfile(userId: string, updates: { name?: string; preferredLanguage?: string }) {
    const user: any = await User.findByIdAndUpdate(userId, updates, { new: true }).catch(() => null);
    if (user) {
      return { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage, isVerified: user.isVerified, picture: user.picture };
    }
    return { id: userId, name: updates.name || "Demo Entrepreneur", email: "user@vyaparmitra.in", preferredLanguage: updates.preferredLanguage || "en", isVerified: true };
  },
};
