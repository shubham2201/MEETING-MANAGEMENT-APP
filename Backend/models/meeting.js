const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    date: {
        type: Date,
        required: true
    },
    startTime: {
        hours: {
            type: Number,
            require: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    },
    endTime: {
        hours: {
            type: Number,
            require: true,
            min: 0,
            max: 23
        },
        minutes: {
            type: Number,
            required: true,
            min: 0,
            max: 59
        }
    },
    attendees: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            _id: false
        }
    ]
});

mongoose.model('Meeting', meetingSchema);