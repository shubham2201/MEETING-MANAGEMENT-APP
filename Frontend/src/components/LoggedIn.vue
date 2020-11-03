<template>
    <nav class="navbar navbar-expand navbar-dark bg-dark " >
        <div class="container">
            <ul class="nav navbar-nav mr-auto ">
                <li class="nav-item" >
                    <router-link class="nav-link" to="/calendar" exact >Calendar</router-link>
                </li>
                <li class="nav-item meeting" >
                    <router-link class="nav-link" to="/meetings" exact>Meetings</router-link>
                </li>
                <li class="nav-item" >
                    <router-link class="nav-link" to="/team" exact>Teams</router-link>
                </li>
            </ul>
            <ul class = "nav navbar-nav">
                <li class="nav-item">
                    <button class="btn btn-danger" exact @click="logout()" >Logout</button>
                </li>
                <li class="nav-item" >
                    <div class="nav-link active name">Hello {{userName}}</div>
                </li>
            </ul>
        </div>
        
    </nav>
</template>

<script>
export default {
    name: 'Navbar',

    data(){
        return{
            userName: localStorage.getItem('user')
        }
    },
    
    methods: {
        logout(){
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
nav li:hover,
 nav li.router-link-active,
 nav li.router-link-exact-active {
   color: white;
   cursor: pointer;
 }

.container{
    margin-top: 0;
}

.nav-item{
    padding: 0 10px;
}

.name{
    cursor: default;
}
</style>
