<template>
    <div class="row">
        <div class="col-3"></div>
        <div class="col-6"> 
            <div class="signup">
                <form method="POST">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" ref="signupName" placeholder="Enter name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" class="form-control" ref="signupEmail" aria-describedby="emailHelp" placeholder="Enter email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" ref="signupPassword" placeholder="Password" name="password" required min="5">
                    </div>
                    <button class="btn btn-info" @click.prevent="signup">Sign Up</button>
                </form>
            </div>
        </div>
        <div class="col-3"></div>
    </div>
</template>

<script>
import { addUser } from '../services/user';
export default {
    name: 'signup',

    methods: {
        signup() {
            const name = this.$refs.signupName.value;
            const email = this.$refs.signupEmail.value;
            const password = this.$refs.signupPassword.value;
            const user = {
                name, 
                email,
                password
            }
            addUser(user)
                .then((response) => {
                    if(response.status === 422) {
                        alert(response.body);
                    } else{
                        alert(`User Sign Up successfully. Login to continue.`);
                        this.$router.push('/login');
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
    border-color: #17a2b8;
}
</style>