const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true},
    password: { type: String, required: true},
    avatar: { type: String, required: false},
    email: { type: String, required: true}, 
    playlist: { type: [Schema.Types.ObjectId], ref: 'track'}
})

module.exports = mongoose.model('user', UserSchema);
