import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../constants'
import { UserService } from '../services'
import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../handlers'
import { userSchema } from '../validations'
import { ApiHandler } from '../helpers/apiHandler'
import { CustomError } from '../helpers'
import { statusCode } from '../constants'
import { AuthRequest, IUser } from '../interfaces'
// import { AuthMiddleware } from "../middlewares";

@controller('/user')
export class UserController {
  constructor(
    @inject(TYPES.UserService) private readonly _userService: UserService
  ) {}

  // Get Routes
  @httpGet('/')
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await this._userService.getUsers()
      if (users) {
        res.send(new ApiHandler(users, 'Users Fetched Successfully'))
      }
    } catch (err) {
      if (!res.headersSent) errorHandler(req, res, next, err)
    }
  }

  @httpGet('/profile', TYPES.AuthMiddleware)
  async getUsersProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.user._id
      console.log(id)
      const user = await this._userService.getUsersById(id)
      if (user) {
        res.send(new ApiHandler(user, 'User Profile Fetched Successfully'))
      }
    } catch (err) {
      if (!res.headersSent) errorHandler(req, res, next, err)
    }
  }

  @httpGet('/protected', TYPES.AuthMiddleware)
  public async protected(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.send({
        message: 'This is protected Route',
        isAuthorized: true,
      })
    } catch (err) {
      errorHandler(req, res, next, err)
    }
  }

  // Post Routes
  @httpPost('/signup')
  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, role, password, profilePicture } = req.body
      console.log({ username, email, role, password, profilePicture })
      const body = { username, email, role, password, profilePicture }
      const validatedBody = await userSchema.validate(body)
      const user = await this._userService.createUser(validatedBody)
      if (user) {
        res.send(new ApiHandler(user, 'User created successfully'))
      } else {
        throw new CustomError(
          'UserNotCreated',
          statusCode.BAD_REQUEST,
          'User is not Created'
        )
      }
    } catch (err) {
      console.error('Error in createUser:', err)
      if (!res.headersSent) {
        errorHandler(req, res, next, err)
      }
    }
  }

  @httpPost('/generateOTP')
  async generateOTP(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const email: string = req.body.email
      console.log(email)
      const length: number = 6 // Default OTP length is 6 digits
      const otp = await this._userService.generateOTP(email, length)
      console.log(otp)
      // req.session.user = otp;
      // req.session.email = email;
      if (otp) {
        res.status(200).json({ message: 'Email Sent Successfully!!!' })
      } else {
        throw new CustomError(
          'UserNotFound',
          statusCode.NOT_ACCEPTABLE,
          'User not Found'
        )
      }
    } catch (error) {
      console.error('Error generating OTP', error)
      res.status(500).json({ error: 'Internal server error', message: error })
    }
  }

  @httpPost('/verifyOTP')
  async verifyOTP(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const { otp } = req.body // Default OTP length is 6 digits
      console.log(otp)
      const result = await this._userService.verifyOTP(otp)
      if (result) {
        res.send({
          result,
          verified: true,
          message: 'User Logged In Successfully',
        })
      }
    } catch (error) {
      console.error('Error generating OTP', error)
      res.status(500).json({ error: 'Internal server error', message: error })
    }
  }

  @httpPost('/login')
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const result = await this._userService.login(email, password)
      // req.headers.authorization = `Bearer ${jwtToken}`;
      if (!result) {
        throw new CustomError(
          'User Not Verified',
          statusCode.UNAUTHORIZED,
          'Please Login Again or Create New Account'
        )
      } else {
        res.send({
          result,
          verified: true,
          message: 'User Logged In Successfully',
        })
      }
    } catch (err) {
      if (!res.headersSent) errorHandler(req, res, next, err)
    }
  }
}
