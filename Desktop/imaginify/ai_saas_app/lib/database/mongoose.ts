import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;
// serverless functions are stateless means they start and do their work and shut down without making a continous connection to db->helps in better scalability
// since next.js works in a serverless environmet therefore we have to connect mongodb everytime
// while we are using it. therefore we cachee the connection
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose
// if the db is not cached
if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}
// if the connection is cached then return the connection
export const connectToDatabase = async () => {
  if(cached.conn) return cached.conn;

  if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');


  //cached.promise = cached.promise ||: This sets cached.promise to itself if it is not null or undefined. Otherwise, it sets it to a new promise created by mongoose.connect.
//  mongoose.connect(MONGODB_URL, { dbName: 'imaginify', bufferCommands: false }): This initiates a connection to the MongoDB database using the connection string from MONGODB_URL. The dbName option specifies the database name, and bufferCommands: false disables Mongoose's buffering of commands.
  cached.promise = 
    cached.promise || 
    mongoose.connect(MONGODB_URL, { 
      dbName: 'imaginify', bufferCommands: false 
    })

  cached.conn = await cached.promise;

  return cached.conn;
}