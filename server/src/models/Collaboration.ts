import mongoose, { Schema, Document, model } from 'mongoose';

export interface ICollaboration extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId | null;
  byUser: mongoose.Types.ObjectId;
  requiredSkills: string[];
  techStack: string[];
  commitment: string;
  duration: string;
  timezone: string;
  rolesNeeded: string[];
  status: 'open' | 'closed';
  likes: mongoose.Types.ObjectId[];
  views: number;
}

const CollaborationSchema = new Schema<ICollaboration>(
  {
    title: {
      type: String,
      required: [true, 'Collaboration title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    byUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    requiredSkills: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 5,
        'Required skills cannot exceed 5 items',
      ],
      default: [],
    },
    techStack: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 8,
        'Tech stack cannot exceed 8 items',
      ],
      default: [],
    },
    commitment: {
      type: String,
      required: [true, 'Commitment duration/hours is required'],
    },
    duration: {
      type: String,
      required: [true, 'Project duration details are required'],
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    rolesNeeded: {
      type: [String],
      required: [true, 'Roles needed are required'],
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Collaboration = model<ICollaboration>('Collaboration', CollaborationSchema);
export default Collaboration;
