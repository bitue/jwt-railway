const express = require('express');
require('dotenv').config();
const dbConnection = require('./config/databaseConfig');
const User = require('./model/userModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const checkAuth = require('./middleware/checkAuth');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/home', (req, res) => {
    res.send('home route ');
});

// sign up
app.post('/signup', async (req, res) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 5);
        const newUser = new User({
            email: req.body.email,
            password: hashPassword
        });

        await newUser.save();
        res.send('user created success ');
    } catch (err) {
        res.send(err.message).status(403);
    }
});

// sign in

app.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            const isValidPass = await bcrypt.compare(req.body.password, user.password);
            if (isValidPass) {
                const token = JWT.sign(
                    { email: req.body.email, id: req.body._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '10h' }
                );
                res.set('auth-token', token);
                res.json({
                    token: token,
                    message: 'login success'
                });
            } else {
                res.send('Auth error').status(401);
            }
        } else {
            res.send('Auth error').status(401);
        }
    } catch (err) {
        res.sendStatus(401);
    }
});

// any protected route

app.get('/makeAdmin', checkAuth, async (req, res) => {
    try {
        await User.update({ $set: { role: true } });

        res.json({
            ...req.user,
            admin: true
        });
    } catch (err) {
        res.send(err.message).status(403);
    }
});

// 404 handle
app.use((req, res, next) => {
    res.send('No routes found').status(404);
});

// error handle by the server
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status).send(err.message);
});

app.listen(PORT, async () => {
    console.log('server is running .....');
    await dbConnection();
});
