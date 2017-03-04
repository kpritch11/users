const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CommentSchema = new Schema({
    content: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
