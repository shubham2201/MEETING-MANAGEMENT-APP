<template>
    <div class="container">
        <AdminPortal />
        <div class="mt-2">
            <h5>Users in the DB.</h5>
            <div class="row" v-if="status === 'MSG'">
                <div class="col-12">
                    <div class="alert alert-info alert-dismissible fade show" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <strong>{{ message }}</strong>
                    </div>
                </div>
            </div>
            <hr>
        </div>

        <div class="card-group">
            <div class="row">
                <div class="card col-5 mt-5 mr-auto" v-for="user in users" :key="user._id">
                    <div class="card-body">
                        <h5 class="card-title">{{ user.name }}</h5>
                        <p class="card-text"> {{ user.email }}</p>
                        <button class="btn btn-info mr-1">Add to Meeting</button>
                        <button class="btn btn-info mr-2 ml-2">Add to Team</button>
                        <button class="btn btn-danger">Delete User</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import AdminPortal from './AdminPortal';
import { getUsers } from '../services/user';

export default {
    name: 'users',

    components: {
        AdminPortal
    },

    data(){
        return{
            users: [],
            message: '',
            status: ''
        }
    },

    mounted(){
        getUsers()
            .then( users => {
                this.users = users;
                console.log(users);
            })
            .catch( error => {
                this.message = error;
                this.status = 'MSG'
            });
    }
}
</script>

<style scoped>
.card{
    border: 8px solid #ccc;
}
</style>