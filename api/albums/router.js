const express = require("express");
const router = express.Router();

const albumController = require("./controller");
const authMiddleware = require("../auth/auth");

router.get("/", (req, res) => {
  albumController
  .getAllAlbum(req.query.page || 1)
  .then(albums => res.send(albums))
  .catch(err => {
      console.error(err);
      res.status(500).send(err);
  });
});

router.get("/:albumId", (req, res) => {
  albumController
  .getAlbum(req.params.albumId)
  .then(album => res.send(album))
  .catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
})

router.post(
  "/",
  // authMiddleware.authorize,
  // upload.single("album"),
  (req, res) => {
    req.body.userId = req.session.userInfo.id;
    req,body.albumFile = req.file;

    albumController
    .createAlbum(req.body)
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
  albumController
  .deleteAlbum(req.params.id, req.session.userInfo.id)
  .then(album => res.send(album))
  .catch(err => {
    console.error(err);
    res.status(err.status).send(err.status);
  });
});

router.post("/:albumId/comments", 
  // authMiddleware.authorize, 
  (req, res) => {
  req.body.userId = req.session.userInfo.id;

  albumController
  .addComment(req.params.albumId, req.body)
  .then(result => res.send(result))
  .catch(err => {
    console.error(err);
    res.status(500).send(err);
  });
});

router.delete(
  "/:albumId/comments/:commentId",
  // authMiddleware.authorize,
  (req, res) => {
    albumController
    .deleteComment(
      req.params.albumId,
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