const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const User = mongoose.model('User');

async function getUsers(req, res, next) {
    try{
        const users = await User.find().exec();
        res.json(users);
    } catch {
        error.status = 500;
        next(error);
    }
}

async function addUsers(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error();
        error.body = errors.errors[0].msg;
        error.status = 422;
        res.json(error);
    } else {
        const user = req.body;
        const password = req.body.password;

        try{
            bcrypt.hash(password, 12)
            .then(hashedPassword => {
                user.password = hashedPassword;
                return user;
            })
            .then(user => {
                User.create(user)
                    .then(result => {
                        res.json(result);
                    })
                    .catch(error => {
                        if( !err.statusCode ){
                            err.statusCode = 500;
                        }
                        next(err);
                    })
            })
            .catch(err => {
                if( !err.statusCode ){
                    err.statusCode = 500;
                }
                next(err);
            });
        }catch {
            const error = new Error();
            error.status = 500;
            error.body = 'Internal Server error';
            next(error);
        }
    }
}

function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                const error = new Error();
                error.body = 'User with this email not found.';
                error.status = 401;
                res.json(error);
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual) {
                const error = new Error();
                error.body = 'Wrong Password';
                error.status = 401;
                res.json(error);
            } else{

                const token = jwt.sign(
                    {
                        email: loadedUser.email,
                        userId: loadedUser._id.toString()
                    },
                    'shukla2201',
                    {expiresIn: '1000h'}
                );

                res.status(200).json({token: token, userEmail: loadedUser.email, userName: loadedUser.name, userId: loadedUser._id});
            }
        })
        .catch( err =>{
            if(!err.statusCode){
                err.statusCode=500;
                next(err);
            }
        })
};

module.exports = {
    getUsers,
    addUsers,
    login
}