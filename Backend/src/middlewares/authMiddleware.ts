import { BaseMiddleware } from 'inversify-express-utils'
import { CustomError } from '../helpers'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { NextFunction, Response } from 'express'
import { AuthRequest } from '../interfaces'
import { errorHandler } from '../handlers'

export class AuthMiddleware extends BaseMiddleware {
  async handler(req: AuthRequest, res: Response, next: NextFunction) {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return errorHandler(
        req,
        res,
        next,
        new CustomError('AuthorizationError', 401, 'Token not Found')
      )
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)

      const user = await User.findById(decoded.id)
      if (!user) {
        return errorHandler(
          req,
          res,
          next,
          new CustomError('NotFoundError', 404, 'No user found with this id')
        )
      }

      req.user = user

      next()
    } catch (error) {
      errorHandler(
        req,
        res,
        next,
        new CustomError(
          'AuthorizationError',
          401,
          'Not authorized to access this route'
        )
      )
    }
  }
}
