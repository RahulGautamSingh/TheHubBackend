const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require('cors');
const app = express();
dotenv.config();
app.use(cors())
app.use(morgan("tiny"));
app.use(express.json());

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    console.log("Mongoose connected");
  }
);

const userRouter = require("./routers/userRouter");
app.use("/user", userRouter);





const PORT = 3200;
app.listen(PORT, () => {
  console.log("Listening at http://localhost:"+PORT);
});
