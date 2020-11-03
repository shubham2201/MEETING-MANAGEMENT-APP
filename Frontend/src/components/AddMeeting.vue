<template>
  <div>
    <h4>Search for Meeting</h4>
    <hr>
     <div class="row" v-if="CREATED === 'YES'">
        <div class="col-12">
            <div class="alert alert-info alert-dismissible fade show" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    <span class="sr-only">Close</span>
                </button>
                <strong>Meeting Ceated Successfully!!</strong>
            </div>
        </div>
    </div>
    <div class="row" v-if="status === 'ERROR'">
        <div class="col-12">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    <span class="sr-only">Close</span>
                </button>
                <strong>{{ errorMsg }}</strong>
            </div>
        </div>
    </div>
    <form method="POST" ref="form" class="filterform"> 

        <div class="form-group">
            <label for="meetingName">Name</label>
            <input type="text" class="form-control" ref="meetingName" placeholder="Meeting Name" required>
        </div>

        <div class="form-group">
            <label for="date">Date</label>
            <input type="date" class="form-control col-5" ref="date" required value = "2020-11-03">
        </div>

        <div class="form-group">
            <label for="startTime">Start Time</label>
            <input type="time" class="form-control col-5" ref="startTime" placeholder="hh" required>
        </div> 

        <div class="form-group">
            <label for="endTime">End Time</label>
            <input type="time" class="form-control col-5" ref="endTime" placeholder="hh" required>
        </div> 

        <div class="form-group">
            <label for="description">Description</label>
            <textarea class="form-control" rows="2" placeholder="What is agenda for meeting?" ref="description" required></textarea>
        </div>

        <div class="form-group">
            <label for="emailIDs">EmailIDs of attendees, or team's short</label>
            <input type="text" class="form-control" ref="emailIds" placeholder="abc@xyz.com, @annual-day, shubham@rupeek.com">
            <sub>Seperate emailIDs / team name by commas - team name should start with @.</sub>
        </div>

        <button type="submit" class="btn btn-primary" @click.prevent="addMeeting()">Add Meeting</button>
    </form>
  </div>
</template>

<script>
import { addMeeting } from '../services/meetings';
import { fetchUsers } from '../services/meetings';
import { fetchTeams } from '../services/team';
const NO = 'NO', YES = 'YES', ERROR = 'ERROR', OK = 'OK';
export default {
  name: 'AddMeeting',

  data(){
      return{
          CREATED: NO,
          status: OK,
          errorMsg: '',
          allUsers: [],
          allTeams: []
      }
  },

  methods: {
      addMeeting() {
          const meeting = {
              "startTime": {
                  "hours": this.$refs.startTime.value.split(':')[0],
                  "minutes": this.$refs.startTime.value.split(':')[1]
              },
              "endTime": {
                  "hours": this.$refs.endTime.value.split(':')[0],
                  "minutes": this.$refs.endTime.value.split(':')[1]
              },
              "name": `${this.$refs.meetingName.value}`,
              "description": `${this.$refs.description.value}`,
              "date": `${this.$refs.date.value}T00:00:00.000Z`,
              "attendees": []
          }

          const startTime = new Date(), endTime = new Date();
          startTime.setHours(meeting.startTime.hours, meeting.startTime.minutes, 0);
          endTime.setHours(meeting.endTime.hours, meeting.endTime.minutes, 0);

          const attendees = this.$refs.emailIds.value.split(','), filteredMembers = [];
            attendees.forEach(attendee => {
              filteredMembers.push(attendee.trim());
            })

            for(let i=0;i<filteredMembers.length;i++) {
                if(filteredMembers[i][0] == '@'){
                    this.allTeams.forEach(team => {
                    if(team.shortName === filteredMembers[i].substr(1)) {
                        team.members.forEach(member=> {
                            meeting.attendees.push({
                                "userId": member.userId,
                                "email" : member.email
                            });
                        })
                    }
                })
                } else {
                    this.allUsers.forEach(user => {
                    if(user.email == filteredMembers[i]) {
                        meeting.attendees.push({
                            "userId": user._id,
                            "email" : filteredMembers[i]
                        })
                    }
                })
                }
            }

            const jsonObject = meeting.attendees.map(JSON.stringify); 
            const uniqueSet = new Set(jsonObject); 
            const uniqueMembers = Array.from(uniqueSet).map(JSON.parse); 

            meeting.attendees = uniqueMembers;
            meeting.name = meeting.name.trim();
            meeting.description = meeting.description.trim();
            console.log(meeting);
          if(meeting.name.length === 0){
              this.status = ERROR;
              this.errorMsg = 'Enter Valid Name';
          }else if(meeting.startTime.minutes === undefined || meeting.startTime.hours===""){
              this.status = ERROR;
              this.errorMsg = 'Enter Start Time';
          } else if(meeting.endTime.minutes  === undefined || meeting.endTime.hours===""){
              this.status = ERROR;
              this.errorMsg = 'Enter End Time';
          } else if(meeting.description.length < 5){
              this.status = ERROR;
              this.errorMsg = 'Min Length of description should be 5';
          } else if(startTime > endTime){
              this.status = ERROR;
              this.errorMsg = 'Start time should be less than End time.';
          } else {
              this.$refs.form.reset();
              addMeeting(meeting).then(() =>{
                    this.CREATED = YES;
                    this.status = OK;
              });
          }
      },

      async getUsers() {
            await fetchUsers()
                    .then(users => {
                        this.allUsers = users;
                    })
                    .catch( error => {
                    console.log(error);
                    })
        },

        async getTeams(){
             fetchTeams()
                    .then(teams => {
                        this.allTeams = teams;
                    })
                    .catch(error => {
                    console.log(error);
                    })
        }
  },

  mounted(){
      this.getUsers();
      this.getTeams();
  }
}
</script>

<style scoped>
.filterform{
  width: 80%;
  margin: auto;
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 10px;
  background-color: #ccc;
}
</style>
