const mongoose = require( 'mongoose' );

const Team = mongoose.model('Team');

async function getTeam(req, res, next) {
    const userId = res.locals.claims.userId;

    try{
        const teams = await Team.find({"members.userId": userId}).exec();
        res.json(teams);
    } catch {
        const error = new Error('Can not able to query db' );
        error.status = 500;
        next(error);
    }
}

async function createTeam(req, res, next) {
    const team = req.body;
    const userId = res.locals.claims.userId, email = res.locals.claims.email;

    if(team.members.length === 0) {
        team.members.push({userId, email});
    } else {
        let found=0;
        team.members.forEach(member => {
            if(member.email === email){
                found=1;
            }
        })
        if(found===0){
            team.members.push({userId, email});
        }
    }

    try{
        const newTeam = await Team.create( team );
        res.json(newTeam);
    } catch {
        const error = new Error('Can not able to query db' );
        error.status = 500;
        next(error);
    }
}

async function removeMemberFromTeam(req, res, next){
    const userId = res.locals.claims.userId, teamId = req.query.teamId;

    try{
        const updatedTeam = await Team.updateOne(
            {_id: teamId},
            {
                $pull:{
                    members:{
                        userId:{
                            $eq: userId
                        }
                    }
                }
            }
        );
        res.json(updatedTeam);
    } catch {
        const error = new Error('Can not able to query db' );
        error.status = 500;
        next(error);
    }
}

async function addMemberToTeam(req, res, next) {
    const teamId = req.body.teamId, userId = req.body.userId, email = req.body.email;

    try{
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            {
                $addToSet: {members: {userId, email}}
            }
        );
        res.json(updatedTeam);
    } catch {
        const error = new Error(' Can not add member');
        error.status = 500;
        next(error);
    }
}

module.exports = {
    getTeam,
    createTeam,
    removeMemberFromTeam,
    addMemberToTeam
}