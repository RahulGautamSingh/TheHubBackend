const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(userObj.password, salt);
  try {
    let payload = {
      username: userObj.username,
      email: userObj.email,
    };
    let tokens = generateTokens(payload);
    let user = new User({
      username: userObj.username,
      email: userObj.email,
      password: hash,
      refreshToken: tokens[1],
    });
    await user.save();
    console.log(user);
    return { status: true, access_token: tokens[0], refresh_token: tokens[1] };
  } catch (err) {
    console.log(err);
    return { status: false, message: err };
  }
};

const findUser = async (userObj) => {
    console.log(userObj)
  let user = await User.findOne({ username:userObj.username }).catch((err) => {
    return { status: false, message: err };
  });
  if (user === null) return { status: false, message: "No such user" };
  try {
    let payload = {
      username: user.username,
      email: user.email,
    };
    let tokens = generateTokens(payload);
    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken: tokens[1] } }
    );

    return { status: true, access_token: tokens[0], refresh_token: tokens[1] };
  } catch (err) {
    return { status: false, message: err };
  }
};

const deleteRefreshTokenOfUser = async (username) => {
  
  try {
    await User.updateOne({ username:username }, { refreshToken: null });
    user = await User.find({ username: username }).catch((err) => {
      return { status: false, message: err };
    });
  
    return { status: true, message: "USER LOGGED OUT" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err };
  }
};

const refreshAccessToken = async (refresh_token) => {
  try {
    console.log(refresh_token);
    let user = await User.findOne({ refreshToken: refresh_token });
    if(user===null) return {status:false,message:"Token Invalid"}
    console.log(user)
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

module.exports = {
  createNewUser,
  findUser,
  deleteRefreshTokenOfUser,
  refreshAccessToken,
};
