const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
  // refreshToken: {
  //   type: String,
  //   required: true,
  //   unique: false,
  // },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
