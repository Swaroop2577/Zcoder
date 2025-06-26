const mongoose = require('mongoose');
require("dotenv").config();
const url = process.env.MONGODB_URI
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zcoder', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
console.log(url)
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;