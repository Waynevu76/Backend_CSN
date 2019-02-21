const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentModels = require('../comments/commentModels');


const TrackSchema = new Schema({
    nameSong: { type: String },
    artist: { type: Schema.Types.ObjectId, ref: 'artist'},
    album: { type: Schema.Types.ObjectId, ref: 'album'},
    genre: { type: [String], default: []},
    like: { type: Number, default: 0 },
    unlike: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    lyrics: String,
    year: {type: Number},
    nation: {type: String},
    createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
    comment: { type: [commentModels], default: []},
    
},
    { timestamps: { createdAt: "createdAt"}}
)

module.exports = mongoose.model('track', TrackSchema);