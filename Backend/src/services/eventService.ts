import { injectable } from 'inversify'
import { CustomError } from '../helpers'
import { statusCode } from '../constants'
import { IEvent } from '../interfaces'
import { Event } from '../models'
import { ObjectId } from 'mongoose'
import mongoose from 'mongoose'
@injectable()
export class EventService {
  constructor() {}

  async createEvent(body: IEvent): Promise<IEvent> {
    const event = await Event.create(body)
    const result = await event.save()
    return result
  }

  async getEvents(): Promise<IEvent[]> {
    const pipeline = [
        {
          $lookup: {
            from: "users",
            localField: 'createdBy',
            foreignField: "_id",
            as: "createdBy"
          }
        },
        {
          $unwind: {
            path: "$createdBy",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            createdBy: "$createdBy.username"
          }
        }
      ];
    const result = await Event.aggregate(pipeline);
    return result;
  }

  async getEventById(id: string): Promise<IEvent> {
    const result = await Event.findById(id);
    if (result) {
      return result
    } else {
      throw new CustomError('NotFound', statusCode.NotFound, 'Event Not Found')
    }
  }

  async updateEvent(id: string, event: IEvent): Promise<void> {
    const existingEvent = await Event.findById(id)
    if (!existingEvent) {
      throw new CustomError('NotFound', statusCode.NotFound, 'Event Not Found')
    }

    await Event.findByIdAndUpdate(id, event)
  }

  async deleteEvent(id: string): Promise<void> {
    const existingEvent = await Event.findById(id)
    if (!existingEvent) {
      throw new CustomError('NotFound', statusCode.NotFound, 'Event Not Found')
    }

    await Event.findByIdAndDelete(id)
  }

  async getUserRegisteredEvents(userId: string): Promise<IEvent[]> {
    const events = await Event.aggregate([
      { $match: { registrations: userId } },
    ])
    return events
  }

  async registerForEvent(eventId: string, userId: ObjectId): Promise<void> {
    const event = await Event.findById(eventId)
    if (!event) {
      throw new CustomError('NotFound', statusCode.NotFound, 'Event Not Found')
    }

    if (
      event.registrations !== undefined &&
      !event.registrations.includes(userId)
    ) {
      event.registrations.push(userId)
      await event.save()
    } else {
      throw new CustomError(
        'Conflict',
        statusCode.Conflict,
        'User Already Registered'
      )
    }
  }

  async getRegistrationsForEvent(
    eventId: string
  ): Promise<{ username: string; email: string }[]> {
    const event = await Event.findById(eventId)
    if (!event || event.registrations === undefined) {
      throw new CustomError('NotFound', statusCode.NotFound, 'Event Not Found')
    }

    // Use aggregation to join Event and User collections
    const registrations = await Event.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
      { $unwind: '$registrations' },
      {
        $lookup: {
          from: 'users', // The collection to join with
          localField: 'registrations',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          username: '$userDetails.username',
          email: '$userDetails.email',
        },
      },
    ])

    return registrations
  }

  async unregisterFromEvent(eventId: string, userId: ObjectId): Promise<void> {
    if(!userId || !eventId){
        throw new CustomError('NotFound', statusCode.NotFound, 'User Not Found')
    }
    const event = await Event.findById(eventId)
    if (!event) {
      throw new CustomError('NotFound', statusCode.NotFound, 'Event Not Found')
    }

    if (event.registrations !== undefined) {
      const index = event.registrations.indexOf(userId)
      if (index > -1) {
        event.registrations.splice(index, 1)
        await event.save()
      }
    } else {
      throw new CustomError(
        'Conflict',
        statusCode.Conflict,
        'User Not Registered for this Event'
      )
    }
  }
}
