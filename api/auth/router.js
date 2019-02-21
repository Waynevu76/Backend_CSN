const express = require("express");
const router = express.Router();

const authController = require("./controller");

router.get("/", (req, res) => {
  const { userInfo } = req.session;
  if (userInfo &&  userInfo.username) {
    res.json(userInfo);
  } else {
    res.status(401).json("Not logging in.");
  }
});

router.post("/", (req, res) => {
  authController
    .login(req.body)
    .then(userInfo => {
      req.session.userInfo = userInfo;
      res.send(userInfo);
    })
    .catch(error => res.status(error.status).send(error.err));
});

router.delete("/", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

module.exports = router;
