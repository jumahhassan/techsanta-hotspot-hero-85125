import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
      console.warn('⚠️  MONGO_URL not found in environment variables');
      console.warn('⚠️  Running without database persistence (in-memory only)');
      return null;
    }

    const conn = await mongoose.connect(mongoURL, {
      // These options are now default in Mongoose 6+
      // but we keep them for clarity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️  Continuing without database (in-memory mode)');
    return null;
  }
};

export default connectDB;
