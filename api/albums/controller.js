const albumModel = require('./albumModels');
const fs = require('fs');

const createAlbum = ({ albumImage, artist, genre }) =>
    new Promise ((resolve, reject) => {
        albumModel
        .create({
            albumImage,
            artist,
            genre
        })
        .then(data => resolve({ id: data._id }))
        .catch(err => reject(err));
    })

const getAllAlbum = page =>
    new Promise((resolve, reject) => {
        albumModel
        .find({
            active: true
        })
        .sort({ createAt: -1 })
        .skip((page -1) * 20)
        .limit(20)
        .select("_id albumName albumImage artist genre view createAt")
        .populate("trackList", "songname")
        .populate("comment.createdBy", "username avartar")
        .exec()
        .then(data => {
            resolve(
                data.map(album =>
                  Object.assign({}, album._doc, {
                    albumUrl: `/api/albums/${album._id}/data`
                  })
                )
            );
        })
        .catch(err => reject(err));
    })
const updateAlbum = (id, { albumImage, albumName, artist, genre }) =>
    new Promise((resolve, reject) => {
      albumModel
      .update(
        {
          _id: id
        },
        {
          albumImage,
          albumName,
          artist,
          genre
        }
      )
      .then(data => resolve({ id: data._id }))
      .catch(err => reject(err));
    });

const deleteAlbum = (id, userId) =>
    new Promise((resolve, reject) => {
      albumModel
      .update(
        {
          _id: id,
          createBy: userId
        },
        { active: false}
      )
      .then(data => resolve({ id: data}))
      .catch(err => reject({ status: 500, err }));
    })

const getAlbum = id =>
  new Promise((resolve, reject) => {
    albumModel
    .update(
      {
        active: true,
        _id: id
      },
      {
        $inc: {
          view: 1
        }
      }
    )
    .then(result =>
      albumModel
      .findOne({
        active: true,
        _id: id
      })
      .select("_id albumImage albumName artist genre view createAt ")
      .populate("trackList", "songname")
      .populate("comment.createdBy", "username avartar")
      .exec()
    )
    .then(data =>
      resolve(
        Object.assign({}, data._doc, { albumUrl:`/api/albums/${album._id}/data` })
      ))
    .catch(err => reject(err))
  });

const addComment = (albumId, { userId, content }) =>
  new Promise((resolve, reject) => {
    albumModel
    .update(
      {
        _id: albumId
      },
      {
        $push: { comment: { createdBy: userId, content }}
      }
    )
    .then(data => resolve(data))
    .catch(err => reject(err));
  });

const deleteComment = (albumId, commentId, userId) =>
  new Promise((resolve, reject) => {
    albumModel
    .update(
      {
        _id: albumId
      },
      {
        $pull: { comment: { _id: commentId, createdBy: userId }}
      }
    )
    .then(data => resolve(data))
    .catch(err => reject(err));
  })


module.exports = {
  createAlbum,
  getAllAlbum,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  addComment,
  deleteComment
};