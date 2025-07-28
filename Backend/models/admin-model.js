const { model, Schema } = require("mongoose");

const AdminSchema = new Schema({
    firstName: {type: String, unique: true, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    users: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
})

module.exports = model('Admin', AdminSchema);