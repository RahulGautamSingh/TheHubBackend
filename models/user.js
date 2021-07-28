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
    unique:false
  },
  followers:{
    type:[mongoose.SchemaTypes.ObjectId],
    default:[],
    unique:false,
    ref:'User'
  },
  following:{
    type:[mongoose.SchemaTypes.ObjectId],
    default:[],
    unique:false,
    ref:'User'
  },
  posts:{
    type:[mongoose.SchemaTypes.ObjectId],
    default:[],
    unique:false,
    ref:'Post'
  },
  image:{
    type:String,
    required:false,
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
