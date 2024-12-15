import dotenv from 'dotenv'

dotenv.config()

let PORT = process.env.PORT
let MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

export default { PORT, MONGODB_URI }
