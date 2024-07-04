import { Schema, Types } from 'mongoose'
import { IEvent } from '../interfaces'
import mongoose from 'mongoose'

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  createdBy: { type: Types.ObjectId, ref: 'User', required: true },
  registrations: { type: [Types.ObjectId], default: [] },
})

// Create the Mongoose model
const Event = mongoose.model<IEvent>('Event', eventSchema)

export default Event
