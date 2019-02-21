const trackModel = require('./trackModels');
const fs = require('fs');

const createTrack = ({ nameSong, artist, album, genre, lyrics, year, nation, userId, trackFile }) =>
    new Promise((resolve, reject) => {
        trackModel
        .create({
          track: fs.readFileSync(trackFile.path),
          contentType: trackFile.mimetype,
          nameSong, 
          artist,
          album,
          genre, 
          lyrics,
          year, 
          nation,
          createdBy: userId
        })
        .then(data => resolve({ id: data._id }))
        .catch(err => reject(err));
    })

const getAllTrack = page =>
    new Promise((resolve, reject) => {
        trackModel
        .find({
            active: true
        })
        .sort({ createAt: -1 })
        .skip((page -1) * 20)
        .limit(20)
        .select("_id nameSong artist album genre like unlike view lyrics year nation comment createAt")
        .populate("artist", "_id nameArtist")
        .populate("album", "_id nameAlbum")
        .populate("createdBy", "_id username avartar")
        .exec()
        .then(data => {
            resolve(
                data.map(track =>
                  Object.assign({}, track._doc, {
                    trackUrl: `/api/tracks/${track._id}/data`
                  })
                )
            );
        })
        .catch(err => reject(err));
    })
const updateTrack = (id, { nameSong, artist, album, genre, lyrics, year, nation }) =>
    new Promise((resolve, reject) => {
      trackModel
      .update(
        {
          _id: id
        },
        {
            nameSong, 
            artist, 
            album, 
            genre, 
            lyrics, 
            year, 
            nation
        }
      )
      .then(data => resolve({ id: data._id }))
      .catch(err => reject(err));
    });

const deleteTrack = (id, userId) =>
    new Promise((resolve, reject) => {
      trackModel
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

const getTrack = id =>
  new Promise((resolve, reject) => {
    trackModel
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
      trackModel
      .findOne({
        active: true,
        _id: id
      })
      .select("_id nameSong artist album genre like unlike view lyrics year nation comment createAt ")
      .populate("artist", "_id nameArtist")
      .populate("album", "_id nameAlbum")
      .populate("createdBy", "_id username avartar")
      .exec()
    )
    .then(data =>
      resolve(
        Object.assign({}, data._doc, { trackUrl:`/api/albums/${id}/data` })
      ))
    .catch(err => reject(err))
  });

const addComment = (trackId, { userId, content }) =>
  new Promise((resolve, reject) => {
    trackModel
    .update(
      {
        _id: trackId
      },
      {
        $push: { comment: { createdBy: userId, content }}
      }
    )
    .then(data => resolve(data))
    .catch(err => reject(err));
  });

const deleteComment = (trackId, commentId, userId) =>
  new Promise((resolve, reject) => {
    trackModel
    .update(
      {
        _id: trackId
      },
      {
        $pull: { comment: { _id: commentId, createdBy: userId }}
      }
    )
    .then(data => resolve(data))
    .catch(err => reject(err));
  })

  const likeTrack = trackId =>
  new Promise((resolve, reject) => {
    trackModel
      .update(
        {
          _id: trackId
        },
        {
          $inc: { like: 1 }
        }
      )
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

const unlikeTrack = trackId =>
  new Promise((resolve, reject) => {
    trackModel
      .update(
        {
          _id: trackId
        },
        {
          $inc: { like: -1 }
        }
      )
      .then(data => resolve(data))
      .catch(err => reject(err));
  });

module.exports = {
  createTrack,
  getAllTrack,
  getTrack,
  updateTrack,
  deleteTrack,
  addComment,
  deleteComment,
  likeTrack,
  unlikeTrack
};