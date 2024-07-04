import { injectable } from 'inversify'
import { IUser } from '../interfaces'
import { User } from '../models'
import { CustomError } from '../helpers'
import { statusCode } from '../constants'
import { messages } from '../constants'
import otpGenerator from 'otp-generator'
import nodemailer from 'nodemailer'

@injectable()
export class UserService {
  private transporter
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'csronly4@gmail.com',
        pass: 'wusy stvr igmp jidj', // Use your actual password here
      },
    })
  }

  async getUsers() {
    return await User.find().exec()
  }

  async createUser(body: any): Promise<IUser> {
    const user = new User(body)
    const result = await user.save()
    if (!result) {
      throw new CustomError(
        messages.User_Not_Created.name,
        statusCode.BAD_REQUEST,
        messages.User_Not_Created.message
      )
    }
    return result
  }

  async login(email: string, password: string) {
    const user: IUser | null = await User.findOne({ email: email })
    if (!user) {
      throw new CustomError(
        messages.INVALID_CREDENTIALS.name,
        statusCode.UNAUTHORIZED,
        messages.INVALID_CREDENTIALS.message
      )
    }
    const matchPasswords = await user.matchPasswords(password)
    if (!matchPasswords) {
      throw new CustomError(
        messages.INVALID_CREDENTIALS.name,
        statusCode.UNAUTHORIZED,
        messages.INVALID_CREDENTIALS.message
      )
    }
    if (user && matchPasswords) {
      const token: string = await user.getSignedToken()
      const refreshToken: string = await user.getSignedToken()
      await User.findOneAndUpdate(
        { email: email },
        { $set: { refreshToken: refreshToken } },
        { new: true }
      )
      return { token, user }
    }
    return null
  }

  async getUsersById(id: string) {
    return await User.findById(id).exec()
  }

  async generateOTP(email: string, length: number) {
    const user = await User.findOne({ email })
    let otp
    if (user) {
      otp = otpGenerator.generate(length, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false, // This line ensures no lowercase alphabets are included
        digits: true,
      })
    }
    console.log(otp)
    if (otp) {
      const otpExpiration = new Date()
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 10)
      await User.findOneAndUpdate(
        { email: email },
        { otp: otp.toString(), otpExpiration: otpExpiration },
        { new: true }
      )
      const result = await this.sendEmail(email, otp)
      if (result) {
        return true
      }
    }
    return false
  }

  async verifyOTP(otp: string) {
    console.log(otp)
    const user = await User.findOne({ otp })
    console.log(user)
    if (user) {
      const currentTime = new Date()
      if (user.otp === otp && (user.otpExpiration as any) > currentTime) {
        const token: string = await user.getSignedToken()
        const refreshToken: string = await user.getSignedToken()
        await User.findOneAndUpdate(
          { otp: otp },
          { $set: { refreshToken: refreshToken, otp: '' } },
          { new: true }
        )
        return { token, user }
      }
      throw new CustomError('InvalidOtp', statusCode.BAD_REQUEST, 'Otp Expired')
    } else {
      throw new CustomError('InvalidOtp', statusCode.BAD_REQUEST, 'Invalid Otp')
    }
  }

  async sendEmail(email: string, otp: string): Promise<any> {
    try {
      const mailOptions = {
        from: 'csronly4@gmail.com',
        to: email,
        subject: 'Your OTP from Sasta-CMS',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #4a4a4a; text-align: center;">Sasta-CMS</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Dear Customer,</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Your One-Time Password (OTP) for Sasta-CMS is:</p>
            <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 5px;">
              <h2 style="color: #4a4a4a; margin: 0; font-size: 24px;">${otp}</h2>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Please use this OTP to complete your verification process. This OTP is valid for a limited time.</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">If you didn't request this OTP, please ignore this email.</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for choosing Sasta-CMS!</p>
            <div style="text-align: center; margin-top: 20px; color: #888; font-size: 14px;">
              <p>© 2024 Sasta-CMS. All rights reserved.</p>
            </div>
          </div>
        `,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log(`Email sent successfully to ${email}`)
      return result
    } catch (error) {
      console.error('Error sending email:', error)
      throw new Error('Failed to send email')
    }
  }
}
