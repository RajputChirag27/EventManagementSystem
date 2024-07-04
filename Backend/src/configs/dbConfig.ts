import mongoose from 'mongoose'
import { config } from 'dotenv'
config()

const url: string | undefined = process.env.MONGO_URL
export default mongoose
  .connect(url as string)
  .then(() => {
    console.log('Database connected Successfully')
  })
  .catch(err => console.error('Error in Connecting database: ' + err))
