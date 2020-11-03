const mongoose = require('mongoose');
const { seed } = require('./seed');

require('../models/meeting');
require('../models/user');
require('../models/team');

const uri = 'mongodb://localhost:27017/Meeting-app';

mongoose.set( 'useFindAndModify', false );
mongoose.set( 'returnOriginal', false );

mongoose.connect(uri, {useNewUrlParser: true});

mongoose.connection.on('open', () =>{
    console.log('connected to db');
    // seed();
});

mongoose.connection.on('error', err => {
    console.error(err.message);
    process.exit();
})