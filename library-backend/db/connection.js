import mongoose from 'mongoose'
import config from '../utils/config.js'

const connectDb = () => {
  console.info('Connecting to MongoDB')
  mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
      console.info('Connected to MongoDB')
    })
    .catch((err) => console.error(err))
}

export default connectDb
