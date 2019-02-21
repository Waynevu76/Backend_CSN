const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const trackController = require("./controller");
const authMiddleware = require("../auth/auth");

router.get("/", (req, res) => {
    trackController
    .getAllTrack(req.query.page || 1)
    .then(tracks => res.send(tracks))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
  });
  
  router.get("/:trackId", (req, res) => {
    trackController
    .getTrack(req.params.trackId)
    .then(track => res.send(track))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
  })
  
  router.post(
    "/",
    // authMiddleware.authorize,
    upload.single("track"),
    (req, res) => {
      // req.body.userId = req.session.userInfo.id;
      req.body.trackFile = req.file;
  
      trackController
      .createTrack(req.body)
      .then(result => res.send(result))
      .catch(err => {
        console.error(err)
        res.status(500).send(err);
      });
    }
  )
  
  router.delete("/:id", 
    // authMiddleware.authorize, 
    (req, res) => {
    trackController
    .deleteTrack(req.params.id, req.session.userInfo.id)
    .then(track => res.send(track))
    .catch(err => {
      console.error(err);
      res.status(err.status).send(err.status);
    });
  });
  
  router.post("/:trackId/comments", 
    // authMiddleware.authorize,
    (req, res) => {
    req.body.userId = req.session.userInfo.id;
  
    trackController
    .addComment(req.params.trackId, req.body)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
  });
  
  router.delete(
    "/:trackId/comments/:commentId",
    // authMiddleware.authorize,
    (req, res) => {
      trackController
      .deleteComment(
        req.params.trackId,
        req.params.commentId,
        req.session.userInfo.id
      )
      .then(result => res.send(result))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      })
    }
  )
  
  module.exports = router;