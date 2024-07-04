import { type ObjectId } from 'mongoose'

export interface IEvent {
  title: string
  description: string
  date: Date
  location: string
  createdBy: ObjectId
  registrations?: ObjectId[]
}
