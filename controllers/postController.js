const Post = require("../models/post");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken")

const createNewPost = async ({ detail, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded)
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let posts = await Post.find({ user: user._id });
    let post = new Post({
      detail: detail,
      user: user._id,
      id: posts.length + 1,
    });
    await post.save();
    return { status: true, message: "POST CREATED" };
  } catch (err) {
    console.log(err)
    return { status: false, "message": err.message };
  }
};

const deletePost = async ({ id, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // let username = decoded.payload.username;
    // let user = await UserModel.findOne({ _id: username });
    let post = await Post.findOneAndDelete({ _id: id });
    return { status: true, message: "POST REMOVED" };
  } catch (err) {
    return { status: false, message: err };
  }
};

const likePost = async ({ id, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.payload.username;
    let user = await UserModel.findOne({ username: username });
    let post = await Post.findOne({ _id: id });
    let likesArr = post.likes;
    likesArr.push(user._id);
    await Post.updateOne({ _id: id }, { likes: [likesArr] });
    return { status: true, message: "POST LIKED" };
  } catch (err) {
    return { status: false, message: err };
  }
};

const fetchPostList = async (access_token) =>{
  try{
    let decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let posts = await Post.find({user:user._id})
    return {status:true,posts:posts}
  }catch (err) {
    return { status: false, message: err.message };
  }
}

module.exports = {
  createNewPost,
  deletePost,
  likePost,
  fetchPostList
};
