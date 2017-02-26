const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // es6 promise

before((done) => {
    mongoose.connect('mongodb://localhost/users_test');
    mongoose.connection
        .once('open', () => {
            console.log('Mongoose connection started');
            done();
        })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});

beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});
