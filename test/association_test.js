const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blog_post');

describe('Associations', () => {
    let joe, alex, blogPost, comment;

    beforeEach((done) => {
        // Create instances
        joe = new User({ name: 'Joe' });
        alex = new User({ name: 'Alex' });
        blogPost = new BlogPost({
            title: 'JS Rules',
            content: 'Yes it does!'
        });
        comment = new Comment({ content: 'Congrats on the great post' });

        // Assign associations
        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = alex;

        // Save instances, (these run in parallel not linearly)
        Promise.all([
            joe.save(),
            alex.save(),
            blogPost.save(),
            comment.save()
        ])
        .then(() => { // once all promises are finished, call done()
            done();
        });
    });

    it('saves a relation between a user and a blogpost', (done) => {
        User.findOne({ name: 'Joe' })
        .populate('blogPosts')
        .then((user) => {
            assert(user.blogPosts[0].title === 'JS Rules');
            done();
        });
    });

    it('saves a full relation graph', (done) => {
        User.findOne({ name: 'Joe' })
        .populate({
            path: 'blogPosts',
            populate: {
                path: 'comments',
                model: 'comment', // model is only required when path != model
                populate: {
                    path: 'user'
                }
            }
        })
        .then((user) => {
            assert(user.name === 'Joe');
            assert(user.blogPosts[0].title === 'JS Rules');
            assert(user.blogPosts[0].content === 'Yes it does!');
            assert(user.blogPosts[0].comments[0].content === 'Congrats on the great post');
            assert(user.blogPosts[0].comments[0].user.name === 'Alex');
            done();
        });
    });
});
