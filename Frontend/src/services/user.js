import axios from 'axios';

export const addUser = (user) => {
    return axios.post(
        `http://localhost:3000/api/user`,
        user,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then(response => {
        return response.data;
    })
    .catch( error => {
        console.log(error);
    })
}

export const signin = (user) => {
    return axios.post(
        `http://localhost:3000/api/login`,
        user
    )
    .then(response => {
        return response.data;
    })
    .catch( error => {
        console.log(error);
    })
}

export const getUsers = () => {
    return axios.get(
        `http://localhost:3000/api/user`,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then(users => {
        return users.data;
    })
    .catch(err => {
        console.log(err);
    })
}