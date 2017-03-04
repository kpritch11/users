const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = require('./post_schema');

mongoose.Promise = global.Promise; // es6 promise

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        validate: {
            validator: (name) => name.length > 2,
            message: 'Name must be longer than 2 characters.'
        }
    },
    posts: [PostSchema],
    age: Number
});

UserSchema.virtual('postCount').get(function() { // use function() instead of () => to access this
    return this.posts.length;
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
