const { execSync } = require('child_process');
const { model } = require('mongoose');
const path = require('path');

// function seed() {
//     try {
//         execSync(`mongoimport --db Meeting-app --collection users --drop --file ${path.join(__dirname, '..', 'data', 'users.json')} --jsonArray`);
//     } catch {
//         console.error('User could not be imported');
//     }
// }

// function seed() {
//     try {
//         execSync(`mongoimport --db Meeting-app --collection meetings --drop --file ${path.join(__dirname, '..', 'data', 'meetings.json')} --jsonArray`);
//     } catch {
//         console.error('User could not be imported');
//     }
// }

function seed() {
    try {
        execSync(`mongoimport --db Meeting-app --collection teams --drop --file ${path.join(__dirname, '..', 'data', 'teams.json')} --jsonArray`);
    } catch {
        console.error('User could not be imported');
    }
}

module.exports = {
    seed
};