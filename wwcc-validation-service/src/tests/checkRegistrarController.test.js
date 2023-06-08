const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server');
const db = require('../models');
const checkRegistrarController = require('../controllers/checkRegistrarController');

describe('Check Registrar Controller', () => {
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
        await db.WWCC.destroy({ truncate: true });
        await db.CheckType.destroy({ truncate: true });
        // Insert sample data as needed for specific test cases

        it('should create a new working with children check', (done) => {
            request(app)
                .post('/wwcc/')
                .send({
                    typeId: 1,
                    userId: 1,
                    registrationNumber: '1234567890',
                    expiryDate: '2023-12-31',
                    isValidated: false
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('workingWithChildrenCheck');
                    // Add more assertions as needed
                    done();
                });
        });

        it('should get all working with children check registrar entries', (done) => {
            request(app)
                .get('/wwcc/')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('workingWithChildrenChecks');
                    // Add more assertions as needed
                    done();
                });
        });

        it('should get all working with children check registrar entries (extended)', (done) => {
            request(app)
                .get('/wwcc/extended')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('workingWithChildrenChecks');
                    // Add more assertions as needed
                    done();
                });
        });

        it('should get a working with children check registrar entry by ID', (done) => {
            // Insert sample data to test fetching by ID
            db.WWCC.create({
                typeId: 1,
                userId: 1,
                registrationNumber: '1234567890',
                expiryDate: '2023-12-31',
                isValidated: false
            }).then((entry) => {
                const referenceId = entry.id;

                request(app)
                    .get(`/wwcc/${referenceId}`)
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('workingWithChildrenChecks');
                        // Add more assertions as needed
                        done();
                    });
            });
        });

        it('should update a working with children check registrar entry by ID', (done) => {
            // Insert sample data to test updating by ID
            db.WWCC.create({
                typeId: 1,
                userId: 1,
                registrationNumber: '1234567890',
                expiryDate: '2023-12-31',
                isValidated: false
            }).then((entry) => {
                const referenceId = entry.id;

                request(app)
                    .patch(`/wwcc/${referenceId}`)
                    .send({
                        typeId: 2,
                        userId: 2,
                        registrationNumber: '0987654321',
                        expiryDate: '2024-12-31',
                        isValidated: true
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.have.property('message', "Working with children's check updated successfully");
                        // Add more assertions as needed
                        done();
                    });
            });
        });

        it('should delete a working with children check registrar entry by ID', (done) => {
            // Insert sample data to test deletion by ID
            db.WWCC.create({
                typeId: 1,
                userId: 1,
                registrationNumber: '1234567890',
                expiryDate: '2023-12-31',
                isValidated: false
            }).then((entry) => {
                const referenceId = entry.id;

                request(app)
                    .delete(`/wwcc/${referenceId}`)
                    .expect(204)
                    .end((err, res) => {
                        if (err) return done(err);
                        // Add more assertions as needed
                        done();
                    });
            });
        });
    });
});