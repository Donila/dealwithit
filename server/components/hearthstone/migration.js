var _ = require('lodash');
var q = require('q');
var Cards = require('../../api/card/card.model');

exports.fromHearthStoneApiToMongoCards = function(hearthstoneApiResult) {
    var deferred = q.defer();
    var cards = [];
    var result = hearthstoneApiResult;
    
    for(var i in result.body) {
        cards.push(result.body[i]);
    }
    
    cards = _.flatten(cards);
    
    Cards.find({}).remove(function() {
        console.log('Cards collection is cleaned.');
        Cards.create(cards, function(err, ok) {
            var message;
            if(err) {
                message = 'Error during migrating from HearthstoneApi to mongodb Cards collection.' + JSON.stringify(err);
                console.log(message);
                deferred.reject(new Error(message));
            } else {
                console.log('Finished migrating cards from HearthstoneApi to mongodb Cards collection.');
                deferred.resolve(cards);
            }
        });
    });
    
    return deferred.promise;
};