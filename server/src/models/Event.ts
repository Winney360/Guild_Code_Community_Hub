import { Schema, model } from 'mongoose';

const ParticipantSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Participant name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Participant email is required'],
    trim: true,
    lowercase: true,
  },
});

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    eventType: {
      type: String,
      enum: ['workshop', 'hackathon', 'meetup', 'webinar', 'training'],
      required: [true, 'Event type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    timezone: {
      type: String,
      default: 'UTC / GMT (UTC+0)',
    },
    mode: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      required: [true, 'Event mode is required'],
    },
    locationOrLink: {
      type: String,
      required: [true, 'Event location or link is required'],
    },
    participants: {
      type: [ParticipantSchema],
      default: [],
    },
    maxParticipants: {
      type: Number,
      default: 0, // 0 = unlimited
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event creator is required'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = model('Event', EventSchema);
export default Event;
