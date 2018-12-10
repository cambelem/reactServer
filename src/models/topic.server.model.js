const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Used for MongoDB however it is not currenlty used.
const TopicsSchema = new Schema({
    topic: String,
    active: Boolean
});

module.exports = mongoose.model('Topics', TopicsSchema);
