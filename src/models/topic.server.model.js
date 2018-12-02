const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicsSchema = new Schema({
    topic: String,
    active: Boolean
});

module.exports = mongoose.model('Topics', TopicsSchema);