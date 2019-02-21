const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentModels = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'user', required: true},
    content: { type: String, required: true }
}, {
    timestamps: { createdAt: 'createdAt' }
})

module.exports = CommentModels; 