const express = require("express");
const {
  fetchPostList,
  createNewPost,
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

module.exports = router;
