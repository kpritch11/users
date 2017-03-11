const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blog_post');

describe('Middleware', () => {
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

    it('removes a relation between a user and a blogpost', (done) => {
        joe.remove()
        .then(() => BlogPost.findOne({ title: 'JS Rules' }))
        .then((element) => {
            assert(element === null);
            done();
        });
    });

    it('removes a relation between a blogpost and a comment', (done) => {
        blogPost.remove()
        .then(() => Comment.findOne({ content: 'Congrats on the great post' }))
        .then((element) => {
            assert(element === null);
            done();
        });
    });

    xit('removes a full relation graph', (done) => {
        joe.remove()
        .then(() => BlogPost.findOne({ title: 'JS Rules' }))
        .then((element) => {
            assert(element === null);
            return Comment.findOne({ content: 'Congrats on the great post' })
        })
        .then((element) => {
            assert(element === null);
            done();
        });
    });
});
