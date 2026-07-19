import mongoose, { Schema, Document, model } from 'mongoose';

export interface IApplication extends Document {
  collaboration: mongoose.Types.ObjectId;
  applicant: mongoose.Types.ObjectId;
  role: string;
  githubUsername: string;
  portfolioLink: string;
  answers: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    collaboration: {
      type: Schema.Types.ObjectId,
      ref: 'Collaboration',
      required: [true, 'Collaboration reference is required'],
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant reference is required'],
    },
    role: {
      type: String,
      required: [true, 'Applied role is required'],
    },
    githubUsername: {
      type: String,
      required: [true, 'GitHub username is required'],
      trim: true,
    },
    portfolioLink: {
      type: String,
      required: [true, 'Portfolio or LinkedIn link is required'],
      trim: true,
      validate: {
        validator: (v: string) => {
          return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please provide a valid URL link',
      },
    },
    answers: {
      type: String,
      required: [true, 'Why Me explanation is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: 'appliedAt', updatedAt: true },
  }
);

export const Application = model<IApplication>('Application', ApplicationSchema);
export default Application;
