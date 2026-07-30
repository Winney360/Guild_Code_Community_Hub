import mongoose, { Schema, Document, model } from 'mongoose';

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId;
  collaborationId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId | null;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment creator is required'],
    },
    collaborationId: {
      type: Schema.Types.ObjectId,
      ref: 'Collaboration',
      required: [true, 'Collaboration target is required'],
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model<IComment>('Comment', CommentSchema);
export default Comment;
