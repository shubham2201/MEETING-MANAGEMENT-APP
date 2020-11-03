<template>
    <div>
        <LoggedIn />
        <div class="container">
            <div class="row">
                <div class="col-12 clearfix">
                    <h3>
                        Calendar
                    </h3>
                    <hr>
                    <div class="float-left">
                            <input type="date" @change="dateChangeHandler( $event )" :value="selectedDate"  />
                            <p><sub>Select Date to see meetings. </sub></p>
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

            <div class="row" v-if="status === 'EMPTY'">
                <div class="col-12">
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <strong>No meeting scheduled today!! Enjoy.</strong>
                    </div>
                </div>
            </div>
            <hr>

            <div class="row" v-if="status === 'LOADED'">
                <div class="col-4 d-flex" v-for="meeting in meetings" :key="meeting._id">
                    <div class="text-reset text-decoration-none w-100 my-3 d-flex flex-column">
                        <div class="card border-info mb-3" style="max-width: 18rem;">
                            <div class="card-header">{{meeting.name}}</div>
                            <div class="card-body text-info">
                                <h5 class="card-title">{{ meeting.description }}</h5>
                                <p class="card-text">
                                    <small>
                                        {{(meeting.date).substr(0, 10)}} 
                                    </small>
                                </p>
                                <p class="card-text">
                                    <small>
                                        <span>{{meeting.startTime.hours}} </span>:
                                        <span>{{meeting.startTime.minutes}} </span> - 
                                        <span>{{meeting.endTime.hours}} </span>:
                                        <span>{{meeting.endTime.minutes}} </span>
                                    </small>
                                </p>
                                <h5 class="card-title">Members :</h5>
                                <i class="card-text" v-for="attendee in meeting.attendees" :key="attendee.userId" style="padding: 0px 0px 0px 5px"> {{attendee.email}} </i><br>
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
import { fetchCalendar } from '../services/meetings';
const LOADING = 'LOADING', LOADED = 'LOADED', ERROR_LOADING = 'ERROR_LOADING', EMPTY = 'EMPTY';
export default {
    name: 'Calendar',
    data() {
        return {
            selectedDate: new Date().toISOString().substr(0, 10),
            status: LOADING,
            meetings: []
        }
    },

    components: {
        LoggedIn
    },

    methods: {
        dateChangeHandler( event ){
            this.selectedDate = event.target.value;
            this.fetchCalendar();
        },
        fetchCalendar(){
            fetchCalendar(this.selectedDate)
            .then( meetings => {
                this.meetings = meetings;
                if(meetings.length > 0){
                    this.status = LOADED;
                } else {
                    this.status = EMPTY;
                }
            })
            .catch( error => {
                this.status = ERROR_LOADING;
                console.log(error);
                this.error = error;
            });
        }
    },
    mounted() {
        this.fetchCalendar();
    }
}
</script>

<style scoped>
</style>