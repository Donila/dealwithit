'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CardsSchema = new Schema({
    patch: String,
    cards: Object
});

module.exports = mongoose.model('Cards', CardsSchema);

