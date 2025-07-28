const {Schema, model} = require('mongoose');

const EventSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
})

module.exports = model('Events', EventSchema);