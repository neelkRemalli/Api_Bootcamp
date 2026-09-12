const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable DNS servers to avoid SRV ECONNREFUSED on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not supported in environment
}

mongoose.set('strictQuery', false);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGOURI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;