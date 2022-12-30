const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require('./models/User');
const Review = require('./models/Review');


// mongoose.connect(process.env.LOCAL_MONGOURI);
mongoose.connect(process.env.MONGOURI);

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    // await Review.create(reviews);
    console.log('successfully imported!!!!!!!!!')
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    // await Review.deleteMany();
    console.log('successfully deleted!!!!!!!!!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === "_import") {
  importData();
} else if (process.argv[2] === "_delete") {
  deleteData();
  
}
