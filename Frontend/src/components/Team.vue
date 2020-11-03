<template>
    <div>
        <LoggedIn />
        <div class="container">
            <div class="row">
                <div class="col-12 clearfix">
                    <h3>Teams</h3>
                    <hr>
                    <p>View your team here.</p>
                    <button class="btn btn-info" @click="toggele">Create New Team</button>
                    <hr>
                    <div class="row" v-if="teamArray === 'EMPTY'">
                        <div class="col-12">
                            <div class="alert alert-info alert-dismissible fade show" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    <span class="sr-only">Close</span>
                                </button>
                                <strong>You are not part of any team. Create new team and add friends.</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 

            <div class="row" v-if="status === 'LOADING'"> 
                <div class="col-12">
                    <div class="alert alert-primary alert-dismissible fade show" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <strong>Loading Workshop!!</strong> Please Wait.
                    </div>
                </div>
            </div>

            <div class="row" v-if="status === 'ERROR_LOADING'">
                <div class="col-12">
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <strong>{{this.error.message}}</strong>
                    </div>
                </div>
            </div>

            <div class="row" v-if="status === 'LOADED'">
                <div class="col-4 d-flex" v-if="showForm"> 
                    <div class="text-reset text-decoration-none w-100 my-3 d-flex flex-column">
                        <form class="card text-white bg-info mb-3">
                            <h5 class="card-header">Create New Team</h5>
                            
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="teamName">Enter Team Name</label>
                                    <input class="form-control" placeholder="Enter Team Name" ref="teamName">
                                </div>
                                <div class="form-group">
                                    <label for="teamShortName">Enter Team Short Name</label>
                                    <input class="form-control"  placeholder="Team Short Name" ref="teamShortName">
                                </div>
                                <div>
                                    <label for="teamDescription">Enter Team Description</label>
                                    <textarea class="form-control" placeholder="Team Description" ref="teamDescription"></textarea>
                                </div>
                                <label for="teamDescription">Enter Members Email</label>
                                <textarea class="form-control" placeholder="Email of members." ref="emailIds"></textarea>
                                <sub>Seperate emailIDs by commas - only registered user will be added. You will be in team by default.</sub>
                                <button class="btn btn-light" style="margin-top: 10px" @click.prevent="createTeam()">Create Team</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-4 d-flex" v-for="team in teams" :key="Math.random() + team._id">
                    <div class="text-reset text-decoration-none w-100 my-3 d-flex flex-row">
                        <div class="card">
                            <h5 class="card-header">{{team.name}}</h5>
                            <div class="card-body">
                                <h6 class="card-title">@{{team.shortName}}</h6>
                                <p class="card-text">{{team.description}}</p>
                                <button class="btn btn-danger" @click="excuseUser(team._id)">Excuse Yourself.</button>
                                <hr>
                                <b class="card-title">Members :</b><br>
                                <i class="card-text" v-for="user in team.members" :key="user.userId" style="padding: 0px 0px 0px 5px"> {{user.email}} </i><br>
                                
                                <select name="excludedMembers" :id="team._id">
                                    <option value="">-- ADD Members --</option>
                                    <option v-for="member in team.excludedMembers" :key="member.userId" :value=member>{{member}}</option>
                                </select>
                                
                                <button class="btn btn-info" style="margin-top: 10px" @click="addMembers(team._id)">Add Members.</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LoggedIn from './LoggedIn.vue';
import { fetchTeams, excuseMember, addMember, createTeam } from '../services/team';
import { fetchUsers } from '../services/meetings';

const LOADING = 'LOADING', LOADED = 'LOADED', ERROR_LOADING = 'ERROR_LOADING', EMPTY = 'EMPTY';
export default {
    name: 'Team',

    data() {
        return {
            status: LOADING,
            teams: [],
            allUsers:[],
            emailOfAllUsers: [],
            showForm: false,
            teamArray: EMPTY
        }
    },

    components: {
        LoggedIn
    },

    methods: {
        toggele(){
            this.showForm = !this.showForm;
        },

        createTeam(){
            const team = {
              "name": `${this.$refs.teamName.value}`,
              "shortName": `${this.$refs.teamShortName.value}`,
              "description": `${this.$refs.teamDescription.value}`,
              "members": []
            }

            const attendees = this.$refs.emailIds.value.split(','), filteredMembers = [];
            attendees.forEach(attendee => {
              filteredMembers.push(attendee.trim());
            })

            for(let i=0;i<filteredMembers.length;i++) {
                this.allUsers.forEach(user => {
                    if(user.email === filteredMembers[i]) {
                        team.members.push({
                            "userId": user._id,
                            "email" : filteredMembers[i]
                        })
                    }
                })
            }

            createTeam(team)
                .then( newTeam => {
                    const excludedMembers = [];

                    this.emailOfAllUsers.forEach( email => {
                        let found=0;
                        newTeam.members.forEach(member => {
                            if(member.email === email){
                                found=1;
                            }
                        })
                        if(found===0){
                            excludedMembers.push(email);
                        }
                    });

                    newTeam.excludedMembers = excludedMembers;
                    this.teams = [newTeam, ...this.teams];

                    if( this.teams.length > 0) {
                        this.teamArray = 'FILLED'
                    } else {
                        this.teamArray = EMPTY
                    }
                })
                .catch(error => {
                    alert(error);
                }) 
                this.toggele();
        },

        async getUsers() {
            await fetchUsers()
                    .then(users => {
                        this.allUsers = users;
                        users.forEach(user => {
                            this.emailOfAllUsers.push(user.email)
                        })
                    })
                    .catch( error => {
                    this.status = ERROR_LOADING;
                    console.log(error);
                    this.error = error;
                })
        },

        async getTeam(){
            const allTeams = await fetchTeams()

            if( allTeams.length > 0) {
                    this.teamArray = 'FILLED'
                } else {
                    this.teamArray = EMPTY
            }

            this.teams = allTeams;
            this.status = LOADED;
            this.teams.forEach( team => {

                const teamMembers = [];
                team.members.forEach(member => {
                    teamMembers.push(member.email);
                })

                const excludedMembers = [];

                this.emailOfAllUsers.forEach( email => {
                    let found=0;
                    teamMembers.forEach(members => {
                        if(members === email){
                            found=1;
                        }
                    })
                    if(found===0){
                        excludedMembers.push(email);
                    }
                });

                team.excludedMembers = excludedMembers;
            })
        },

        excuseUser(teamId){
            excuseMember(teamId)
            .then(() => {
                let ind;

                this.teams.forEach( (team, index) => {
                    if(team._id === teamId) {
                        ind = index;
                    }
                })

                this.teams = [
                    ...this.teams.slice(0, ind),
                    ...this.teams.slice(ind+1)
                ];

                if( this.teams.length > 0) {
                    this.teamArray = 'FILLED'
                } else {
                    this.teamArray = EMPTY
                }

                this.getTeam();
            })
            .catch( error => {
                    this.status = ERROR_LOADING;
                    console.log(error);
                    this.error = error;
                })
        },

        async addMembers(teamId){
            const email = document.getElementById(`${teamId}`).value;
            let userId;

            this.allUsers.forEach(user => {
                if(user.email === email) {
                    userId = user._id;
                }
            });

            const addDetails = {
                "teamId": teamId,
                "userId": userId,
                "email": email
            }

            console.log(addDetails);

            try{
                const updatedTeam = await addMember(addDetails);

                let ind;

                this.teams.forEach( (team, index) => {
                    if(team._id === updatedTeam._id){
                        ind = index;
                    }
                });

                this.teams = [
                    ...this.teams.splice(0, ind),
                    updatedTeam,
                    ...this.teams.splice(ind+1)
                ]

                this.getTeam();
            } catch (error) {
                console.error(error);
            }
        }
    },

    mounted() {
        this.getUsers();
        this.getTeam();
    }
}
</script>