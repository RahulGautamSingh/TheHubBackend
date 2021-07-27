const express = require("express");
const {
  fetchPostList,
  createNewPost,
  likePost,
  dislikePost,
} = require("../controllers/postController");
const router = express.Router();

//fetch posts list for a user
router.get("/", async (req, res) => {
  // console.log(req)
  let result = await fetchPostList(req.headers.access_token);
  if (result.status) res.status(200).json({ posts: result.posts });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
});

//add a post
router.post("/", async (req, res) => {
  console.log(req.body);
  let result = await createNewPost(req.body);
  if (result.status) res.status(200).json({ message: result.message });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
});

//like a post
router.post("/like/:id",async(req,res)=>{
  let token = req.headers.access_token;
  let id = req.params.id;
  let result = await likePost({id,token})
  if (result.status) res.status(200).json({ message: result.message });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
})

//dislike a post
router.post("/dislike/:id",async(req,res)=>{
  let token = req.headers.access_token;
  let id = req.params.id;
  let result = await dislikePost({id,token})
  if (result.status) res.status(200).json({ message: result.message });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
})
module.exports = router;
