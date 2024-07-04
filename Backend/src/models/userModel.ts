import mongoose, { Schema } from 'mongoose'
import { IUser } from '../interfaces/IUser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default:
        'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  ;(this.password as string) = await bcrypt.hash(this.password as string, salt)
  next()
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  const update: any = this.getUpdate()
  if (update.password) {
    const salt = await bcrypt.genSalt(10)
    update.password = await bcrypt.hash(update.password, salt)
  }
  next()
})

UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  )
}

// UserSchema.methods.setRefreshToken = function (payload) {
//   return jwt.sign({ payload }, process.env.JWT_SECRET, {
//     expiresIn: process.env.REFRESH_JWT_EXPIRESIN
//   })
// }

UserSchema.methods.matchPasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model<IUser>('User', UserSchema)
