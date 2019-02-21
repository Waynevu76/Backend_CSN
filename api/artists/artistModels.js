const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentModels = require('../comments/commentModels');

const ArtistSchema = new Schema({
    nameArtist: { type: String, required: true },
    avatarArtist: { type: String, required: true },
    description: String,
    track: [{ type: Schema.Types.ObjectId, ref: 'track'}],
    album: [{ type: Schema.Types.ObjectId, ref: 'album'}],
    createdBy: { type: Schema.Types.ObjectId, ref: "user", required: true },
    comment: {type: [commentModels], default: []}
}, {
    timestamps: {  createdAt: "createAt"}
}
)

module.exports = mongoose.model('artist', ArtistSchema);