const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const token = req.header( 'Authorization' );

    if(!token){
        return res.status(403).json({
            message: 'Token is not set'
        });
    }

    jwt.verify(token, 'shukla2201', function(error, claims){
        if(error) {
            return res.status( 403 ).json({
                message: 'Go away intruder'
            });
        }

        res.locals.claims = claims;
        next();
    })
}

module.exports = {
    authenticate
};