<template>
    <div>
        <LoggedIn />
        <div class="container">
            <div class="row">
                <div class="col-12 clearfix">
                    <h3>Meetings</h3>
                    <hr>
                </div>
            </div>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <router-link class="nav-link " :to="{ name: 'search-meeting'}">Filter / Search meetings</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'add-meeting' }">Add a meeting</router-link>
                </li>
            </ul>
            
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import LoggedIn from './LoggedIn.vue';
export default {
    name: 'Meetings',

    components: {
        LoggedIn
    },
}
</script>