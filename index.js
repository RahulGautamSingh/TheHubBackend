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
const postRouter = require("./routers/postRouter");
const { getUserData } = require("./controllers/userController");
app.use("/user", userRouter);
app.use("/post", postRouter)

app.post("/profile/:id",async(req,res)=>{
  let token = req.headers.access_token;
  let username = req.params.id==="me"?null:req.params.id;
  console.log(username)
  let result = await getUserData({token,username})
  if (result.status) res.status(200).json({user:result.obj.user,posts:result.obj.posts,follow:result.obj.follow });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
})



const PORT = 3200;
app.listen(process.env.PORT, () => {
  console.log("Listening at http://localhost:"+process.env.PORT);
});
