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
    likes: Number,
    blogPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'blogPost'
    }]
});

UserSchema.virtual('postCount').get(function() { // use function() instead of () => to access this === joe (model instance)
    return this.posts.length;
});

UserSchema.pre('remove', function(next) {
    const BlogPost = mongoose.model('blogPost');
    BlogPost.remove({ _id: { $in: this.blogPosts } })
    .then(() => {
        next();
    });
});

// doesn't work all the way yet, one to many to many
/*UserSchema.pre('remove', function(next) {
    console.log('UserSchema.pre()');
    const BlogPost = mongoose.model('blogPost');
    const Comment = mongoose.model('comment');
    let comments;

    BlogPost.find({ _id: { $in: this.blogPosts } })
    .populate({
        path: 'blogPosts',
        populate: {
            path: 'comments',
            model: 'comment'
        }
    })
    .then((blogPosts) => {
        comments = blogPosts.comments;
        console.log(blogPosts);
        console.log(comments);
        return BlogPost.remove({ _id: { $in: this.blogPosts } })
    })
    .then(() => Comment.remove({ _id: { $in: comments } }))
    .then(() => next());
});*/

const User = mongoose.model('user', UserSchema);

module.exports = User;
