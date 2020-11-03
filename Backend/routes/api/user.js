const express = require('express');
const { body } = require('express-validator/check');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const { getUsers, addUsers, login } = require('../../controllers/user.controller');
const { authenticate } = require('../../utils/auth');
const { get } = require('./team');
const router = express.Router();

router.post('/user', [
    body('name').trim().not().isEmpty().withMessage('Enter valid name.'),
    body('password').trim().isLength({min:5}).withMessage('Password min length shoul be 5.'),
    body('email')
    .isEmail()
    .withMessage('Please enter valid email.')
    .custom((value, {req}) => {
        return User.findOne({email: value}).then(user => {
            if(user) {
                return Promise.reject('Email address already exist');
            }
        });
    })
    .normalizeEmail()
], addUsers);

router.get('/user', authenticate ,getUsers);
router.post('/login', login);

module.exports = router;