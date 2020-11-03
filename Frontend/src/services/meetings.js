import axios from 'axios';

export const fetchCalendar = ( date ) => {
    return axios.get(
        `http://localhost:3000/api/calendar?date=${date}`,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        })
        .then(response => {
            return response.data;
        })
        .catch( error => {
            console.log(error.message);
        });
}

export const fetchMeetings = ( date, searchTerms )=> {
    return axios.get(
        `http://localhost:3000/api/meetings?date=${date}&searchTerms=${searchTerms}`,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        })
        .then( response => {
            return response.data;
        })
        .catch( error => {
            console.log(error.message);
        });
}


export const excuseUserFromMeeting = ( meetingId ) => {
    return axios.delete(
        `http://localhost:3000/api/meetings/${meetingId}`,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then(() => {
        console.log('User Execuses');
    })
    .catch( error => {
        console.log(error.message);
    });
}

export const fetchUsers = () => {
    return axios.get(
        `http://localhost:3000/api/user`,
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

export const addUserToMeeting = (meetingId, user) => {
    return axios.post(
        `http://localhost:3000/api/meetings/${meetingId}`,
        user,
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


export const addMeeting = (meeting) => {
    return axios.post(
        `http://localhost:3000/api/meetings-add`,
        meeting,
        {
            headers: {
                'Authorization': localStorage.getItem( 'token' )
            }
        }
    )
    .then( response => {
        console.log(`Added Data: ${response.data}`);
        return response.data;
    })
    .catch( error => {
        console.log(error.message);
    });
}