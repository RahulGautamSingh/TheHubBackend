const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const Post = require("../models/post");
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function generateTokens(payload) {
  let access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
  let refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });
  return [access_token, refresh_token];
}

const createNewUser = async (userObj) => {
  if (!validateEmail(userObj.email))
    return { status: false, message: "Invalid email format." };

  let user = await User.findOne({ username: userObj.username });
  if (user !== null)
    return { status: false, message: "Username already exists." };

  user = await User.findOne({ email: userObj.email });
  if (user !== null)
    return { status: false, message: "Email ID already in use." };

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userObj.password, salt);
  try {
    let payload = {
      username: userObj.username,
      email: userObj.email,
    };
    let tokens = generateTokens(payload);

    user = new User({
      username: userObj.username,
      email: userObj.email,
      password: hash,
    });
    await user.save();
    // console.log(user);
    let r_t = new Token({ token: tokens[1], user: user._id });
    await r_t.save();
    return { status: true, access_token: tokens[0], refresh_token: tokens[1] };
  } catch (err) {
    console.log(err);
    return { status: false, message: err };
  }
};

const findUser = async (userObj) => {
  console.log(userObj);
  let user = await User.findOne({ username: userObj.username }).catch((err) => {
    return { status: false, message: err };
  });
  if (user === null) return { status: false, message: "No such user" };
  let result = bcrypt.compareSync(userObj.password, user.password); // true
  if (!result) return { status: false, message: "Wrong password" };

  try {
    let payload = {
      username: user.username,
      email: user.email,
    };
    let tokens = generateTokens(payload);
    // await User.updateOne(
    //   { _id: user._id },
    //   { $set: { refreshToken: tokens[1] } }
    // );
    let r_t = new Token({ token: tokens[1], user: user._id });
    await r_t.save();
    return { status: true, access_token: tokens[0], refresh_token: tokens[1] };
  } catch (err) {
    return { status: false, message: err };
  }
};

const deleteRefreshTokenOfUser = async (refreshToken) => {
  try {
    await Token.deleteOne({ token: refreshToken });

    // await User.updateOne({ username:username }, { refreshToken: null });
    // user = await User.find({ username: username }).catch((err) => {
    //   return { status: false, message: err };
    // });

    return { status: true, message: "USER LOGGED OUT" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err };
  }
};

const refreshAccessToken = async (refresh_token) => {
  try {
    // console.log(refresh_token);
    let r_t = await Token.findOne({ token: refresh_token });
    if (r_t === null) return { status: false, message: "Token Invalid" };
    // console.log(user)
    let user = await User.findOne({ _id: r_t.user });
    let payload = {
      username: user.username,
      email: user.email,
    };
    let access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
    return { status: true, access_token: access_token };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

const followUser = async ({ token, username }) => {
  try {
    // console.log(token);
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let followerName = decoded.username;
    let follower = await User.findOne({ username: followerName });
    let user = await User.findOne({ username: username });
    follower.following.push(user._id);
    await follower.save();
    user.followers.push(follower._id);
    await user.save();
    return { status: true, message: "FOLLOWED" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

const unfollowUser = async ({ token, username }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let followerName = decoded.username;
    let follower = await User.findOne({ username: followerName });
    let user = await User.findOne({ username: username });
    follower.following.pull(user._id);
    await follower.save();
    user.followers.pull(follower._id);
    await user.save();
    return { status: true, message: "UNFOLLOWED" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

const suggestedList = async (token) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = await User.findOne({ username: decoded.username });
    let userArr = [user._id, ...user.following];
    console.log(userArr);
    let arr = await User.find({ _id: { $nin: userArr } })
      .populate("user")
      .limit(5);

    // console.log("arrat",arr)
    return { status: true, suggestedList: arr };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

const getUserData = async ({ token, username }) => {
  let userName = username;
  let follow = null;
  //check for loggedInUSer
  if (userName === null) {
    try {
      let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userName = decoded.username;
    } catch (err) {
      console.log(err);
      return { status: false, message: err.message };
    }
  } else {
    //checking if loggedInUsser follows searched user or not
    try {
      let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      let loggedInUser = await User.findOne({ username: decoded.username });
      let user = await User.findOne({ username: userName });
      if (user.followers.includes(loggedInUser._id)) follow = true;
      else follow = false;
    } catch (err) {
      console.log(err);

      return{status:false,message:err.message}
    }
  }
  //get users profile and posts and send them to router
  try {
    let user = await User.findOne({ username: userName }).populate('posts');
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let loggedInUser = await User.findOne({ username: decoded.username });
    let posts = user.posts;
    posts  =  posts.map(elem=>{
      if(elem.likes.includes(loggedInUser._id)) return {...elem._doc,liked:true}
      else return {...elem._doc,liked:false}
    })

    return { status: true, obj: { user: user, posts:posts ,follow: follow } };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};
module.exports = {
  createNewUser,
  findUser,
  deleteRefreshTokenOfUser,
  refreshAccessToken,
  followUser,
  unfollowUser,
  suggestedList,
  getUserData
};
