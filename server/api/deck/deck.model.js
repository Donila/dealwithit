'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeckSchema = new Schema({
    name: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    //cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
    cards: [{ cardId: String, count: Number }],
    class: String,
    added: Date
});

DeckSchema
    .path('cards');
    /*.validate(function(cards) {
        var cardsCount = 0;
        for(var i in cards) {
            cardsCount += cards[i].count;
        }
        if(cardsCount == 30)
            return true;
        else return false;
    }, 'В колоде должно быть 30 кард');*/

module.exports = mongoose.model('Deck', DeckSchema);
