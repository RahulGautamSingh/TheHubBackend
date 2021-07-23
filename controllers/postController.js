const Post = require("../models/post");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

const createNewPost = async ({ detail, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let post = new Post({
      detail: detail,
      user: user._id,
    });
    await post.save();
    let postsArr = user.posts;
    postsArr.push(post._id);
    await UserModel.updateOne({ _id: user._id }, { posts: postsArr });
    return { status: true, message: "POST CREATED" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

const deletePost = async ({ id, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    user.posts.pull(id);
    await user.save();
    await Post.findOneAndDelete({ _id: id });
    return { status: true, message: "POST REMOVED" };
  } catch (err) {
    console.log(err)
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
    console.log(err)
    return { status: false, message: err };
  }
};

const fetchPostList = async (access_token) => {
  try {
    let decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let posts = [];
    user.followers.forEach(async(elem) => {
    let arr = await Post.find({user:elem}).populate('posts')
    posts.push(...arr)
    });
    if(posts.length>20) posts = posts.slice(0,20)
    return { status: true, posts: posts };
  } catch (err) {
    console.log(err.message)
    return { status: false, message: err.message };
  }
};

module.exports = {
  createNewPost,
  deletePost,
  likePost,
  fetchPostList,
};
