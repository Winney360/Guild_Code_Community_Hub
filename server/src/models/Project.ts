import { Schema, model, Types } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    shortDescription: {
      type: String,
      maxlength: [150, 'Short description cannot exceed 150 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: ['Web', 'Mobile', 'Design', 'AI'],
      required: [true, 'Category is required'],
    },
    techStack: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 8,
        'Tech stack cannot exceed 8 items',
      ],
      default: [],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    byUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner (User) is required'],
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
    links: {
      liveDemo: { type: String, default: '' },
      github: { type: String, default: '' },
      figma: { type: String, default: '' },
      notebook: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'in-progress',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOfficialGuildCode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = model('Project', ProjectSchema);
export default Project;
