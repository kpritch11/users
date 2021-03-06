const assert = require('assert');
const User = require('../src/user');

describe('Subdocuments', () => {
    it('can create a subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [
                { title: 'React'},
                { title: 'Redux' },
                { title: 'Webpack' },
                { title: 'Node' },
                { title: 'Mongo' }
            ]
        });

        joe.save()
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
            assert(user.posts[0].title === 'React');
            assert(user.posts[1].title === 'Redux');
            assert(user.posts[2].title === 'Webpack');
            assert(user.posts[3].title === 'Node');
            assert(user.posts[4].title === 'Mongo');
            done();
        });
    });

    it('can add subdocuments to an existing record', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: []
        });

        joe.save()
        .then(() => User.findOne({ name: 'Joe' })) // .then(() => { return User.findOne({ name: 'Joe' }) })
        .then((user) => {
            user.posts.push({ title: 'New Post' });
            return user.save()
        })
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
            assert(user.posts[0].title === 'New Post');
            done();
        });
    });

    it('can remove a subdocument from an existing record', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ title: 'Existing Title' }]
        });

        joe.save()
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
            user.posts[0].remove();
            return user.save()
        })
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
            assert(user.posts.length === 0);
            done();
        });
    });
});
