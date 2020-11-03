<template>
  <div>
    <div>
        <h5>Search for Meeting</h5>
        <hr>
        <form action="" method="POST" class="filterform"> 
          <div class="form-group container ">
            <label for="date">Date</label>
            <select name="date dropdown-menu" ref="date" class="form-control">
                <option value="past">Past</option>
                <option value="today" selected>Today</option>
                <option value="future">Upcoming</option>
                <option value="all">All</option>
            </select>
          </div>

          <div class="form-group container ">
            <label for="searchTerms">Search For</label>
            <textarea class="form-control" name="searchTerms" placeholder="search using words that describe the meeting" ref="searchTerms"></textarea>
          </div>
          <div class="container">
            <button type="button" @click.prevent="filterChangeMethod()" class="btn btn-primary">Filter</button>
          </div>
        </form>
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
        <hr style="border-color:rgb(6, 117, 117)">    
        <div>
          <h5>Meeting Matching Search criteria</h5>
          <hr>
          <div class="row" v-if="EMPTY === 'EMPTY'">
                <div class="col-12">
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <strong>No meeting matching search criteria.</strong>
                    </div>
                </div>
            </div>
        </div>

        <div class="row" v-if="status === 'LOADED'">
            <div class="col-4 d-flex " v-for="meeting in meetings" :key="Math.random() + meeting._id">
                <div class="text-reset text-decoration-none w-100 my-3 d-flex flex-row ">
                    <div class="card ">
                        <div class="card-body ">
                            <h4 class="card-title">{{meeting.name}}</h4>
                            <div class="card-text">
                                <div>
                                    <small>
                                        {{(meeting.date).substr(0, 10)}} 
                                     </small>
                                </div>
                                
                                <small>
                                    <span>{{meeting.startTime.hours}} </span>:
                                    <span>{{meeting.startTime.minutes}} </span> - 
                                    <span>{{meeting.endTime.hours}} </span>:
                                    <span>{{meeting.endTime.minutes}} </span>
                                </small>
                                <div>
                                    {{ meeting.description }}
                                </div>
                                <button class="btn btn-danger" @click="excuseUser(meeting._id)">Excuse Yourself</button>
                                <hr>
                                <b>Attendees:</b>
                                <div>
                                    <i class="card-text" v-for="attendee in meeting.attendees" :key="attendee.userId" style="padding: 0px 0px 0px 5px"> {{ attendee.email}} </i>
                                </div>
                                <form action="" class="form-group">
                                  <select name="attendee" :id="meeting._id" class="form-control">
                                    <option value="" class="form-control">--Select Users--</option>
                                    <option v-for="user in meeting.userAbsent" :key="user.id" :value=user class="form-control">{{ user }}</option>
                                  </select>
                                  <button class="btn btn-primary" @click.prevent="addAttendee(meeting._id)">Add Attendees</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

  </div>
</template>

<script>
import { fetchMeetings, excuseUserFromMeeting, fetchUsers, addUserToMeeting } from '../services/meetings';

const LOADING = 'LOADING', LOADED = 'LOADED', ERROR_LOADING = 'ERROR_LOADING', EMPTY = 'EMPTY';
export default {
  name: 'SearchMeeting',

  data() {
        return {
            selectedDate: 'today',
            status: LOADING,
            meetings: [],
            searchTerms:'',
            allUsersEmail: [],
            users: [],
            filterStatus: EMPTY
        }
    },
  
  methods: {

    filterChangeMethod( ) {
      this.selectedDate = this.$refs.date.value;
      this.searchTerms = this.$refs.searchTerms.value;
      this.fetchMeetings();
    },

    fetchMeetings() {
        fetchMeetings(this.selectedDate, this.searchTerms)
          .then(meetings => {
                if(meetings.length > 0) {
                  this.EMPTY = 'FILLED'
                } else {
                  this.EMPTY = 'EMPTY'
                }
                meetings.forEach(meeting => {
                  
                  const userPresent = [];
                  meeting.attendees.forEach( attendee => {
                    userPresent.push(attendee.email);
                  })

                  const userAbsent = [];
                  this.allUsersEmail.forEach(email => {
                    let found=0;

                    userPresent.forEach(user => {
                      if(user === email){
                        found=1;
                      }
                    })

                    if( found===0 ) {
                      userAbsent.push(email);
                    }
                  })
                  meeting.userAbsent = userAbsent;
                })

                this.meetings = meetings;
                this.status = LOADED;
          })
          .catch( error => {
                this.status = ERROR_LOADING;
                console.log(error);
                this.error = error;
          });
    },

    excuseUser( meetingId ) {
      excuseUserFromMeeting(meetingId)
                .then( () =>{
                  this.fetchMeetings();
                })
                .catch( error => {
                  this.status = ERROR_LOADING;
                  console.log(error);
                  this.error = error;
                });
    },

    async addAttendee(meetingId) {
      const emailToBeAdded = document.getElementById(`${meetingId}`).value;
      let id = undefined;
      
      this.users.forEach( user => {
        if(user.email == emailToBeAdded) {
          id = user._id;
        }
      });

      const user = {"userId": id, "email": emailToBeAdded};
      
      try{
        let ind;
        const updatedMeeting = await addUserToMeeting(meetingId, user);
        console.log(updatedMeeting);

        this.meetings.forEach((meeting, index) => {
          if(meeting._id === updatedMeeting._id){
            ind = index;
          }

          this.meetings = [
            ...this.meetings.slice(0, ind),
            updatedMeeting,
            ...this.meetings.slice(ind + 1)
          ];

          this.fetchMeetings();
        })
      } catch (error) {
        console.error(error);
      }
    }
  },

    mounted() {
      fetchUsers()
        .then(users => {
          this.users = users;

          users.forEach(element => {
            this.allUsersEmail.push(element.email);
          });
        })
        .catch( error => {
          this.status = ERROR_LOADING;
          console.log(error);
          this.error = error;
        });
      this.fetchMeetings()
    }
}
</script>

<style scoped>
.filterform{
  width: 50%;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 5px;
  margin-bottom: 10px;
  background-color: #ccc;
}
</style>