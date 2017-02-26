const assert = require('assert');
const User = require('../src/user');

describe('Deleting a user', () => {
    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        joe.save()
        .then(() => {
            done();
        });
    });

    function assertNull(operation, done) {
        operation
        .then(() => User.findOne({ name: 'Joe' }))
        .then((user) => {
            assert(user === null);
            done();
        });
    }

    it('model instance remove', (done) => {
        assertNull(
            joe.remove(),
            done
        );
    });

    it('model class remove', (done) => {
        assertNull(
            User.remove({ name: 'Joe' }),
            done
        );
    });

    it('model class findOneAndRemove', (done) => {
        assertNull(
            User.findOneAndRemove({ name: 'Joe' }),
            done
        );
    });

    it('model class findByIdAndRemove', (done) => {
        assertNull(
            User.findByIdAndRemove(joe._id),
            done
        );
    });
});
