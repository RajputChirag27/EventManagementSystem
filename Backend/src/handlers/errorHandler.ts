import { Response, NextFunction } from 'express'
import { CustomError } from '../helpers'
import { statusCode } from '../constants'
import { AuthRequest } from '../interfaces'

export const errorHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
  err: any
) => {
  try {
    console.log(err)
    console.log(
      'Custom Error Handler => ',
      err.name,
      err.message,
      err.statusCode,
      err.message
    )

    if (res) {
      return res.status(err.statusCode || 500).json({
        success: false,
        error: err.message,
        errorName: err.name,
        message: err.message,
      })
    } else {
      throw new CustomError(
        'Response object is not defined',
        statusCode.INTERNAL_SERVER_ERROR,
        'Internal Server Error'
      )
    }
  } catch (error) {
    next(error) // Forward the error to the next error handler
  }
}
