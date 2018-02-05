const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { ExtractJwt, Strategy: JwtStrategy } = passportJWT;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

const jwtProtected = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Unauthorized'
                }
            });
        }

        req.user = user;
        next(null, req, res);
    })(req, res, next);
};

const passwordProtected = function (req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Invalid credentials'
                }
            });
        }

        res.json({
            accessToken: user.accessToken,
        });
    })(req, res, next);
};

passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        user.validatePassword(password, (err, isValid) => {
            if (err) {
                return done(err);
            }

            if (!isValid) {
                return done(null, false);
            }

            const payload = { id: user.id, username: user.username };
            const accessToken = jwt.sign(payload, jwtOptions.secretOrKey);

            return done(null, { accessToken });
        });
    });
}));

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    next(null, jwt_payload);
}));

module.exports = {
    passport,
    jwtProtected,
    passwordProtected,
};
