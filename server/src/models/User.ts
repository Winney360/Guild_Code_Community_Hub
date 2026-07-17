import { Schema, model } from 'mongoose';
const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email address'],
        },
        password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: [6, 'Password must be at least 6 characters'],
          select: false, // Don't return password in queries by default
        },
        role: {
          type: String,
          enum: ['member', 'admin'],
          default: 'member',
        },
        specializations: {
          type: [String],
          default: [],
        },
        location: {
          type: String,
          default: '',
        },
        linkedin: {
          type: String,
          default: '',
        },
        github: {
          type: String,
          default: '',
        },
        skills: {
          type: [String],
          default: [],
        },
        bio: {
          type: String,
          maxlength: [300, 'Bio cannot exceed 300 characters'],
          default: '',
        },
        profilePicture: {
          type: String,
          default: '',
        },
        joinDate: {
          type: Date,
          default: null, // Set on admin approval, NOT on signup
        },
        isActive: {
          type: Boolean,
          default: false, // False until admin approves
        },
        status: {
          type: String,
          enum: ['pending', 'active', 'suspended'],
          default: 'pending',
        },
      },
      {
        timestamps: true,
      }
    );

export const User = model('User', UserSchema);