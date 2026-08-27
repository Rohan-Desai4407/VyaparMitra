import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.js";
import { config } from "../config/env.js";

// Memory storage fallback if MongoDB is not running
const inMemoryUsers: Map<string, IUser> = new Map();

export const authService = {
  async register(name: string, email: string, password: string, preferredLanguage: string = "en") {
    const existingUser = await User.findOne({ email }).catch(() => inMemoryUsers.get(email));
    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    let newUser: IUser;

    try {
      newUser = await User.create({ name, email, passwordHash, preferredLanguage });
    } catch (dbErr) {
      // Memory fallback
      const mockUser = {
        _id: "user_" + Date.now(),
        name,
        email,
        passwordHash,
        preferredLanguage,
        createdAt: new Date(),
      } as any;
      inMemoryUsers.set(email, mockUser);
      newUser = mockUser;
    }

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, config.jwtSecret, { expiresIn: "7d" });
    return { user: { id: newUser._id, name: newUser.name, email: newUser.email, preferredLanguage: newUser.preferredLanguage }, token };
  },

  async login(email: string, password: string) {
    let user = await User.findOne({ email }).catch(() => inMemoryUsers.get(email));
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
    return { user: { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage }, token };
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId).catch(() => null);
    if (user) {
      return { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage };
    }
    return { id: userId, name: "Demo Entrepreneur", email: "user@vyaparmitra.in", preferredLanguage: "en" };
  },

  async updateProfile(userId: string, updates: { name?: string; preferredLanguage?: string }) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).catch(() => null);
    if (user) {
      return { id: user._id, name: user.name, email: user.email, preferredLanguage: user.preferredLanguage };
    }
    return { id: userId, name: updates.name || "Demo Entrepreneur", email: "user@vyaparmitra.in", preferredLanguage: updates.preferredLanguage || "en" };
  },
};
