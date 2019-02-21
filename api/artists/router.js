const express = require("express");
const router = express.Router();

const artistController = require("./controller");
const authMiddleware = require("../auth/auth");

router.get("/", (req, res) => {
    artistController
    .getAllArtist(req.query.page || 1)
    .then(artists => res.send(artists))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
  });
  
  router.get("/:artistId", (req, res) => {
    artistController
    .getArtist(req.params.artitId)
    .then(artist => res.send(artist))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
  })
  
  router.post(
    "/",
    // authMiddleware.authorize,
    // upload.single("artist"),
    (req, res) => {
      req.body.userId = req.session.userInfo.id;
      req,body.artistFile = req.file;
  
      artistController
      .createArtist(req.body)
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
    artistController
    .deleteArtist(req.params.id, req.session.userInfo.id)
    .then(artist => res.send(artist))
    .catch(err => {
      console.error(err);
      res.status(err.status).send(err.status);
    });
  });
  
  router.post("/:artitstId/comments", 
    // authMiddleware.authorize, 
    (req, res) => {
    req.body.userId = req.session.userInfo.id;
  
    artistController
    .addComment(req.params.artistId, req.body)
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
  });
  
  router.delete(
    "/:artistId/comments/:commentId",
    // authMiddleware.authorize,
    (req, res) => {
      artistController
      .deleteComment(
        req.params.artistId,
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