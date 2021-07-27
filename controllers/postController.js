const Post = require("../models/post");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");

const createNewPost = async ({ detail, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let post = new Post({
      detail: detail,
      user: user._id,
    });
    await post.save();
    let postsArr = user.posts;
    postsArr.push(post._id);
    await user.save();
    // await UserModel.updateOne({ _id: user._id }, { posts: postsArr });
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
    console.log(err);
    return { status: false, message: err };
  }
};



const dislikePost = async ({ id, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let post = await Post.findOne({ _id: id });
    
    post.likes.pull(user._id);
    await post.save()
    return { status: true, message: "POST LIKED" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};


const likePost = async ({ id, token }) => {
  try {
    let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let post = await Post.findOne({ _id: id });
    let likesArr = post.likes;
    post.likes.push(user._id);
    await post.save();
    return { status: true, message: "POST LIKED" };
  } catch (err) {
    console.log(err);
    return { status: false, message: err.message };
  }
};

const fetchPostList = async (access_token) => {
  try {
    let decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    let username = decoded.username;
    let user = await UserModel.findOne({ username: username });
    let posts = await Post.find({
      'user' : user.following
  }).populate('user').limit(20); 
 posts  =  posts.map(elem=>{
    if(elem.likes.includes(user._id)) return {...elem._doc,liked:true}
    else return {...elem._doc,liked:false}
  })
  console.log(posts)
    return { status: true, "posts": posts };
  } catch (err) {
    console.log(err.message);
    return { status: false, message: err.message };
  }
};

module.exports = {
  createNewPost,
  deletePost,
  likePost,
  fetchPostList,
  dislikePost
};
