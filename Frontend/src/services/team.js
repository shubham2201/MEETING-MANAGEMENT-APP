import axios from 'axios';

export const fetchTeams = () => {
    return axios.get(
        `http://localhost:3000/api/teams`,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then( response => {
        return response.data;
    })
    .catch( error => {
        console.log(error.message);
    });
}

export const excuseMember = (teamId) => {
    return axios.delete(
        `http://localhost:3000/api/teams?teamId=${teamId}`,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then( response => {
        return response.data;
    })
    .catch( error => {
        console.log(error);
    })
}

export const addMember = (addDetails) => {
    return axios.post(
        `http://localhost:3000/api/teams-add`,
        addDetails,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then( response => {
        return response.data;
    })
    .catch( error => {
        console.log(error);
    })
}

export const createTeam = (team) => {
    return axios.post(
        `http://localhost:3000/api/teams`,
        team,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then(response =>{
        return response.data;
    })
    .catch( error => {
        console.log(error);
    })
}