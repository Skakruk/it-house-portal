require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const authorizationService = require('./services/authorization');

const port = process.env.PORT || 8080;
const app = express();
const whitelist = ['http://localhost:3000'];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}));
app.use(authorizationService.passport.initialize());

mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`);

app.post('/auth/password', authorizationService.passwordProtected);

app.get('/user/self', authorizationService.jwtProtected, function (req, res) {
    res.json({
        id: req.user.id,
        username: req.user.username,
    });
});

app.all('*', function (req, res) {
    res.status(404).json({ error: 'Not found' });
});

app.use(function (err, req, res) {
    console.log(err);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

