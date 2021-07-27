const express = require("express");
const {
  createNewUser,
  findUser,
  deleteRefreshTokenOfUser,
  refreshAccessToken,
  followUser,
  unfollowUser,
  suggestedList,
  getUserData,
} = require("../controllers/userController");

const router = express.Router();

// router.get("/", async (req, res) => {
//     let { access_token } = req.body;
//     let result = await userData(access_token);
//     if (result.status) res.status(200).json({ user: result.user });
//     else res.status(400).json({ message: result.message });
//   });

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let result = await createNewUser(req.body);
  if (result.status)
    res
      .status(200)
      .json({
        access_token: result.access_token,
        refresh_token: result.refresh_token,
      });
  else res.status(400).json({ message: result.message });
});

router.post("/login", async (req, res) => {
  let result = await findUser(req.body);
  if (result.status)
    res.status(200).json({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
  else res.status(400).json({ message: result.message });
});

router.post("/logout", async (req, res) => {
  // let { username } = req.body;
  let result = await deleteRefreshTokenOfUser(req.headers.refresh_token);
  if (result.status) res.status(200).json({ message: result.message });
  else res.status(400).json({ message: result.message });
});

router.post("/token", async (req, res) => {
  let result = await refreshAccessToken(req.headers.refresh_token);
  if (result.status)
    res.status(200).json({ access_token: result.access_token });
  else res.status(400).json({ message: result.message });
});

router.post("/follow", async (req, res) => {
  console.log(req.body);
  let result = await followUser(req.body);
  if (result.status) res.status(200).json({ message: result.message });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
});

router.post("/unfollow", async (req, res) => {
  let result = await unfollowUser(req.body);
  if (result.status) res.status(200).json({ message: result.message });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
});

router.get("/suggestions", async (req, res) => {
  let result = await suggestedList(req.headers.access_token);
  if (result.status) res.status(200).json({ list: result.suggestedList });
  else if (result.message === "jwt expired")
    res.status(401).json({ message: result.message });
  else res.status(400).json({ message: result.message });
});


module.exports = router;
