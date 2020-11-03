const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { route } = require('./meetings');

const router = express.Router();
const User = mongoose.model( 'User' );

router.post('/auth/login', (req, res, next) =>{
    const credentials = req.body;

    User.findOne( credentials )
        .exec(( error, result) => {
            if( error ){
                error.status=403;
                return next(error);
            }
            if(!result || typeof result !== 'object' || Object.keys(result).length === 0){
                const error = new Error( 'unknown db error' );
                error.status=500;
                return next( error );
            }

            const claims = { email: result.email, userId: result._id};

            jwt.sign(claims, 'shukla2201', {expiresIn: '2300h'}, function(error, token){
                console.log('Token generated');

                if(error){
                    return res.status(401).json({message: error.message});
                }

                res.status(200).json({
                    message: 'Signed in successfully',
                    token: token,
                    email: result.email,
                    name: result.name,
                    password: result.password
                });
            })
        })
});

module.exports = router;