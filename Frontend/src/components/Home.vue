<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-3">Welcome to Meeting-App</h1>
            <p class="lead">Login to Continue.</p>
            <small id="emailHelp" class="form-text text-muted">Don't have account? Sign-Up to Continue.</small>
            <hr class="my-2">
            
            <ul class="form-row" >
                <li class="col">
                    <router-link class="form-control btn btn-primary btn-lg" :to="{ name: 'login'}">Login</router-link>
                </li>
                <li class="col">
                    <router-link class="form-control btn btn-info btn-lg" :to="{ name: 'signup'}">Sign Up</router-link>
                </li>
            </ul>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'Welcome',

}
</script>


<style scoped>
.container{
    margin-top: 20px;
}
ul{
    list-style: none;
}

</style>