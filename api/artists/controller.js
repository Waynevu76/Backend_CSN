const artistModel = require('./artistModels');
const fs = require('fs');

const createArtist = ({ nameArtist, description}) =>
    new Promise ((resolve, reject) => {
        artistModel
        .create({
            nameArtist,
            avatarArtist,
            description
        })
        .then(data => resolve({ id: data._id }))
        .catch(err => reject(err));
    })

const getAllArtist = page =>
    new Promise((resolve, reject) => {
        artistModel
        .find({
            active: true
        })
        .sort({ createAt: -1 })
        .skip((page -1) * 20)
        .limit(20)
        .select("_id nameArtist avartarArtist description track album comment")
        .populate("track", "_id songName")
        .populate("album", "_id albumName")
        .exec()
        .then(data => {
            resolve(
                data.map(artists =>
                  Object.assign({}, artists._doc, {
                    artistUrl: `/api/artist/${artists._id}/data`
                  })
                )
            );
        })
        .catch(err => reject(err));
    })
const updateArtist = (id, { nameArtist, avatarArtist, description }) =>
    new Promise((resolve, reject) => {
      artistModel
      .update(
        {
          _id: id
        },
        {
          nameArtist,
          avatarArtist,
          description
        }
      )
      .then(data => resolve({ id: data._id }))
      .catch(err => reject(err));
    });

const deleteArtist = (id, userId) =>
    new Promise((resolve, reject) => {
      artistModel
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

const getArtist = id =>
  new Promise((resolve, reject) => {
    artistModel
    .update(
      {
        active: true,
        _id: id
      }
    )
    .then(result =>
      artistModel
      .findOne({
        active: true,
        _id: id
      })
      .select("_id nameArtist avatarArtist description track album comment ")
      .populate("track", "songname")
      .populate("album", "albumName")
      .populate("comment.createdBy", "username avartar")
      .exec()
    )
    .then(data =>
      resolve(
        Object.assign({}, data._doc, { artistUrl:`/api/artists/${artists._id}/data` })
      ))
    .catch(err => reject(err))
  });

const addComment = (artistId, { userId, content }) =>
  new Promise((resolve, reject) => {
    artistModel
    .update(
      {
        _id: artistId
      },
      {
        $push: { comment: { createdBy: userId, content }}
      }
    )
    .then(data => resolve(data))
    .catch(err => reject(err));
  });

const deleteComment = (artistId, commentId, userId) =>
  new Promise((resolve, reject) => {
    artistModel
    .update(
      {
        _id: artistId
      },
      {
        $pull: { comment: { _id: commentId, createdBy: userId }}
      }
    )
    .then(data => resolve(data))
    .catch(err => reject(err));
  })


module.exports = {
 createArtist,
 getAllArtist,
 getArtist,
 updateArtist,
 deleteArtist,
 addComment,
 deleteComment
};