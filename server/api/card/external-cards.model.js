'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ExternalCardsSchema = new Schema({
    patch: String,
    cards: Object
});

module.exports = mongoose.model('ExternalCards', ExternalCardsSchema);

