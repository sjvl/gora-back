const mongoose = require('mongoose');

const spaceSchema = mongoose.Schema({
	name: String,
	admin: Array,
	ground: String,
	foreground: String,
	walls: Object,
});

const Space = mongoose.model('spaces', spaceSchema);

module.exports = Space;