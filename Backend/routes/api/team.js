const express = require( 'express' );

const { authenticate } = require('../../utils/auth');
const { getTeam, createTeam, removeMemberFromTeam, addMemberToTeam } = require('../../controllers/team.controller');

const router = express.Router();

router.get('/teams',authenticate, getTeam);
router.post('/teams',authenticate, createTeam);
router.delete('/teams',authenticate, removeMemberFromTeam);
router.post('/teams-add',authenticate, addMemberToTeam);

module.exports = router;