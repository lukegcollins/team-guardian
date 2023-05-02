// Import required modules and files
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const dotenv = require("dotenv").config();
const { user: User, role: Role } = require('../models');
const logger = require('./logger')

// Get the base name of the current file
const fn = require('path').basename(__filename);

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_TOKEN_SECRET
};

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwtPayload, done) => {
            try {
                const user = await User.findByPk(jwtPayload.id);

                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            } catch (error) {
                done(error, false);
            }
        })
    );
};
