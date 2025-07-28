const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    firstName: {type: String, unique: true, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true, unique: true},
    events: [{ type: Schema.Types.ObjectId, ref: 'Events' }],
})

module.exports = model('Users', UserSchema);