const express = require('express');

const { authenticate } = require('../../utils/auth');

const {
    sendCalendar,
    sendMeetings, 
    excuseUserFromMeeting,
    addUserToMeeting,
    addMeeting
} = require('../../controllers/meetings.controller');

const router = express.Router();

router.get('/calendar', authenticate, sendCalendar);
router.get('/meetings', authenticate, sendMeetings);
router.delete('/meetings/:meetingId', authenticate, excuseUserFromMeeting);
router.post('/meetings/:meetingId', authenticate, addUserToMeeting);
router.post('/meetings-add', authenticate, addMeeting);

module.exports = router;

