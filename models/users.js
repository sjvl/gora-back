const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userName: String,
	password: String,
	token: String,
	createdSpace: [{ type: mongoose.Schema.Types.ObjectId, ref: 'spaces' }],
	visitedSpace: [{ type: mongoose.Schema.Types.ObjectId, ref: 'spaces' }],
});

const User = mongoose.model('users', userSchema);

module.exports = User;