const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server');
const db = require('../models');
const checkTypeController = require('../controllers/checkTypeController');

describe('Check Type Controller', () => {
    before(async () => {
        // Perform any necessary setup before running the tests
        await db.sequelize.sync(); // Sync the database models
    });

    after(async () => {
        // Perform any necessary cleanup after running the tests
        await db.sequelize.drop(); // Drop the database tables
    });

    beforeEach(async () => {
        // Clear any existing data before each test
        await db.CheckType.destroy({ truncate: true });
        // Insert sample data as needed for specific test cases
    });

    it('should create a new working with children check type', (done) => {
        request(app)
            .post('/wwcc/types')
            .send({
                name: 'Type 1',
                description: 'Working with Children Check Type 1'
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('checkType');
                // Add more assertions as needed
                done();
            });
    });

    it('should get all working with children check types', (done) => {
        request(app)
            .get('/wwcc/types')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('checkTypes');
                // Add more assertions as needed
                done();
            });
    });

    it('should get a working with children check type by ID', (done) => {
        // Insert sample data to test fetching by ID
        db.CheckType.create({
            name: 'Type 1',
            description: 'Working with Children Check Type 1'
        }).then((checkType) => {
            const typeId = checkType.id;

            request(app)
                .get(`/wwcc/types/${typeId}`)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('checkType');
                    // Add more assertions as needed
                    done();
                });
        });
    });

    it('should update a working with children check type by ID', (done) => {
        // Insert sample data to test updating by ID
        db.CheckType.create({
            name: 'Type 1',
            description: 'Working with Children Check Type 1'
        }).then((checkType) => {
            const typeId = checkType.id;

            request(app)
                .patch(`/wwcc/types/${typeId}`)
                .send({
                    name: 'Type 2',
                    description: 'Working with Children Check Type 2'
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('message', 'WWCC type updated successfully');
                    // Add more assertions as needed
                    done();
                });
        });
    });

    it('should delete a working with children check type by ID', (done) => {
        // Insert sample data to test deletion by ID
        db.CheckType.create({
            name: 'Type 1',
            description: 'Working with Children Check Type 1'
        }).then((checkType) => {
            const typeId = checkType.id;

            request(app)
                .delete(`/wwcc/types/${typeId}`)
                .expect(204)
                .end((err, res) => {
                    if (err) return done(err);
                    // Add more assertions as needed
                    done();
                });
        });
    });
});
