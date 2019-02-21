const express = require('express');
const router = express.Router();
const userController = require('./controller');

router.use((req, res, next) => {
    next();
})

router.post('/', (req, res) => {
    userController
    .createUser(req.body)
    .then(id => res.send({ data: id}))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
})

router.get("/", (req, res) => {
    userController
      .getAllUsers(req.query.page || 1)
      .then(users => res.send(users))
      .catch(err => {
        console.error(err);
        res.status(500).send(err);
      });
  });

module.exports = router;