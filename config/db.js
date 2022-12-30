const mongoose = require('mongoose');


const connectDB = async()=>{
    await mongoose.connect(process.env.MONGOURI);
    // await mongoose.connect(process.env.LOCAL_MONGOURI);
    console.log(`connected to DB!!!!!!!!!!!!!!!!`);
}


module.exports = connectDB;