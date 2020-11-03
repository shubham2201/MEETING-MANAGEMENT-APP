<template>
    <div class="row">
        <div class="col-3"></div>
        <div class="col-6"> 
        <div class="login">
            <form method="POST">
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" ref="loginEmail" aria-describedby="emailHelp" placeholder="Enter email" required>
                </div>
                <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" ref="loginPassword" placeholder="Password" required>
                </div>
                <button type="submit" class="btn btn-primary" @click.prevent="login()">Log In</button>
            </form>
        </div>
    </div>
    <div class="col-3"></div>
    </div>
</template>

<script>
import {  signin } from '../services/user';
export default {
    name: 'login',
    methods: {
        login() {
            const email = this.$refs.loginEmail.value;
            const password = this.$refs.loginPassword.value;
            const user = { 
                email,
                password
            }
            signin(user)
                .then((response) => {
                    if(response.status === 401) {
                        alert(response.body);
                    } else{
                        console.log(response);
                        localStorage.setItem( 'token', response.token);
                        localStorage.setItem( 'user', response.userName);
                        this.$router.push('/calendar');
                    }
                })
                .catch(error => {
                    alert(error);
                });
        }
    }
}
</script>

<style scoped>
.form-control{
    border-color: #0062cc;
}
</style>