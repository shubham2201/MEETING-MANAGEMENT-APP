require('./db/init');
const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/api/auth');
const apiMeetingsRouter = require('./routes/api/meetings');
const apiUserRouter = require('./routes/api/user');
const apiTeamRouter = require('./routes/api/team');

const app = express();
app.use( cors() );

app.use( express.json());
app.use(express.urlencoded());

app.use('/api', authRouter);
app.use('/api', apiMeetingsRouter);
app.use('/api', apiUserRouter);
app.use('/api', apiTeamRouter);

app.listen(3000, ()=>{
    console.log('Server is running on 3000');
})