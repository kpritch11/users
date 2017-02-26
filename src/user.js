const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise; // es6 promise

const UserSchema = new Schema({
    name: String
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
