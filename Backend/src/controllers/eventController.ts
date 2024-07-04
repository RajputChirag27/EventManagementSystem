import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../constants'
import { EventService } from '../services'
import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../handlers'
import { userSchema } from '../validations'
import { ApiHandler } from '../helpers/apiHandler'
import { CustomError } from '../helpers'
import { statusCode } from '../constants'
import { AuthRequest, IEvent, IUser } from '../interfaces'

@controller('/event', TYPES.AuthMiddleware)
export class EventController {
  constructor(
    @inject(TYPES.EventService) private readonly _eventService: EventService
  ) {}

  @httpGet('/')
  async getEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this._eventService.getEvents()
      if (result) {
        res
          .status(statusCode.OK)
          .json(new ApiHandler(result, 'Events Fetched Successfully'))
      } else {
        throw new CustomError(
          'Not Found',
          statusCode.NOT_FOUND,
          'Events not found'
        )
      }
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpPost('/')
  async createEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, description, date, location } = req.body
      const createdBy = req.user._id
      const sanitizedBody: IEvent = {
        title,
        description,
        date,
        location,
        createdBy,
      }
      const result = await this._eventService.createEvent(sanitizedBody)
      if (result) {
        res
          .status(statusCode.CREATED)
          .json(new ApiHandler(result, 'Event Created Successfully'))
      }
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpGet('/:id/registrations')
  async getRegistrationsForEvent(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const eventId = req.params.id
      const registrations =
        await this._eventService.getRegistrationsForEvent(eventId)
      res
        .status(statusCode.OK)
        .json(
          new ApiHandler(registrations, 'Registrations Fetched Successfully')
        )
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpGet('/user/:userId/registrations')
  async getUserRegisteredEvents(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.userId
      const events = await this._eventService.getUserRegisteredEvents(userId)
      res
        .status(statusCode.OK)
        .json(
          new ApiHandler(events, 'User Registered Events Fetched Successfully')
        )
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpPost('/:id/register')
  async registerForEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id;
      const userId = req.user._id;
      await this._eventService.registerForEvent(eventId, userId);
      res
        .status(statusCode.OK)
        .json(new ApiHandler(null, 'User Registered Successfully'))
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpGet('/:id')
  async getEventById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id
      const result = await this._eventService.getEventById(id)
      if (result) {
        res
          .status(statusCode.CREATED)
          .json(new ApiHandler(result, 'Event Fetched Successfully'))
      }
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpPut('/:id')
  async updateEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id
      const event = req.body
      await this._eventService.updateEvent(id, event)
      res
        .status(statusCode.OK)
        .json(new ApiHandler(null, 'Event Updated Successfully'))
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  @httpDelete('/:id')
  async deleteEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this._eventService.deleteEvent(id);
      res
        .status(statusCode.OK)
        .json(new ApiHandler(null, 'Event Deleted Successfully'));
    } catch (err) {
      errorHandler(req, res, next, err);
    }
  }

  @httpDelete('/:id/unregister')
  async unregisterFromEvent(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const eventId = req.params.id;
      const  userId  = req.user._id;
      await this._eventService.unregisterFromEvent(eventId, userId);
      res
        .status(statusCode.OK)
        .json(new ApiHandler(null, 'User Unregistered Successfully'));
    } catch (err) {
      errorHandler(req, res, next, err);
    }
  }
}
