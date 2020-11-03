const mongoose = require('mongoose');

const Meetings = mongoose.model('Meeting');
const User = mongoose.model('User');

async function sendCalendar(req, res, next){
    let date = new Date(req.query.date), userId = res.locals.claims.userId;
    try{
        const allMeetings = await Meetings.find().exec();
        if(date === undefined || userId === undefined)res.json(allMeetings);
        
        date = date.toISOString().substr(0, 10);
        const meetings = [];
        allMeetings.forEach(meeting => {
            const fullDate = new Date(meeting.date).toISOString().substr(0, 10);
            if(fullDate === date ){
                meeting.attendees.forEach(attendee => {
                    if(attendee.userId == userId){
                        meetings.push(meeting);
                    }
                })
            }
        });
        res.json(meetings);
    } catch ( error ){
        error.status = 500;
        next(error);
    }
}



async function sendMeetings(req, res, next) {
    const date = req.query.date, userId = res.locals.claims.userId, searchTerms = req.query.searchTerms;

    try{
        const filter = {date: {}, attendees: { $elemMatch: { }}};

        if(userId) {
            filter.attendees.$elemMatch.userId = userId;
        }

        if(searchTerms) {
            filter.description = {
                $regex: new RegExp( searchTerms, "i")
            };
        }

        const today = new Date().toISOString().substr(0, 10);
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = tomorrow.toISOString().substr(0, 10);
        switch(date) {
            case "past": 
                filter.date.$lt = today;
                break;
            case "today":
                filter.date = {$gte:today, $lt: tomorrow};
                break;
            case "future":
                filter.date.$gt = today;
                break;
            default:
                delete filter.date;
        }
        const meetings = await Meetings
                                .find(filter)
                                .exec((error, results) => {
                                    if(error) {
                                        error.status=500;
                                        return next(error);
                                    }
                                    res.json(results);
                                });
    } catch ( error ){
        error.status = 500;
        next(error);
    }
}



async function excuseUserFromMeeting(req, res, next) {
    const userId = res.locals.claims.userId, meetingId = req.params.meetingId;
    
    try{
        await Meetings.update( {_id: meetingId}, {$pull:{attendees: { userId: { $eq: userId}}}} );
        
        res.status( 204 ).send();
    } catch ( error ){
        error.status = 404;
        next( error );
    }
}



async function addUserToMeeting(req, res, next) {
    const data = req.body, meetingId = req.params.meetingId;
    
    let user;
    if( typeof data === 'object' && Object.keys(data).length === 0 ) {
        const error = new Error( 'User data is missing' );
        error.status = 400;
        next( error );
    }

    if( data instanceof Array ) {
        user = data;
    } else {
        user = [ data ];
    }
    try{
        const updatedMeeting = await Meetings.findByIdAndUpdate( meetingId, {$addToSet:{attendees: user}} );
        
        res.json(updatedMeeting);
    } catch ( error ){
        error.status = 404;
        next( error );
    }
}



async function addMeeting(req, res, next){
    const meeting = req.body;

    const currentUser = { "userId": `${res.locals.claims.userId}`, "email": `${res.locals.claims.email}`};

    if(meeting.attendees.length === 0) {
        meeting.attendees.push(currentUser);
    } else {
        let found=0;
        meeting.attendees.forEach(member => {
            if(member.email === currentUser.email){
                found=1;
            }
        })
        if(found===0){
            meeting.attendees.push(currentUser);
        }
    }

    

    if( typeof meeting === 'object' && Object.keys(meeting).length === 0 ) {
        const error = new Error( 'Meeting data is missing' );
        error.status = 400;
        next( error );
    }

    try{
        const addeddMeeting = await Meetings.create(meeting);
        
        res.status(204).json(addeddMeeting);
    } catch ( error ){
        error.status = 404;
        next( error );
    }
}

module.exports = {
    sendMeetings,
    sendCalendar,
    excuseUserFromMeeting,
    addUserToMeeting,
    addMeeting
}