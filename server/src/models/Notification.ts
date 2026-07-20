import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: 'application_received' | 'application_accepted' | 'application_rejected' | 'collab_closed' | 'application_update' | 'project_mention' | 'system_announcement' | 'collaboration_request' | 'event_update';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['application_received', 'application_accepted', 'application_rejected', 'collab_closed', 'application_update', 'project_mention', 'system_announcement', 'collaboration_request', 'event_update'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
