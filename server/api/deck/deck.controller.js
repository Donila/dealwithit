'use strict';

var _ = require('lodash');
var Deck = require('./deck.model');

var filterCards = function (cards) {
    var newCards = [];
    for (var i in cards) {
        newCards.push({cardId: cards[i].card.cardId, count: cards[i].count});
    }

    return newCards;
};

// Get list of decks
exports.index = function (req, res) {
    Deck.find({})
        .populate('author')
        .sort({added: -1})
        .exec(function (err, decks) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, decks);
        });
};

// Get a single deck
exports.show = function (req, res) {
    Deck.findById(req.params.id)
        .populate('author')
        .exec(function (err, deck) {
            if (err) {
                return handleError(res, err);
            }
            if (!deck) {
                return res.send(404);
            }
            return res.json(deck);
        });
};

// Creates a new deck in the DB.
exports.create = function (req, res) {
    req.body.cards = filterCards(req.body.cards);

    Deck.create(req.body, function (err, deck) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, deck);
    });
};

// Updates an existing deck in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    req.body.cards = filterCards(req.body.cards);
    Deck.findById(req.params.id, function (err, deck) {
        if (err) {
            return handleError(res, err);
        }
        if (!deck) {
            return res.send(404);
        }
        var updated = _.merge(deck, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, deck);
        });
    });
};

// Deletes a deck from the DB.
exports.destroy = function (req, res) {
    Deck.findById(req.params.id, function (err, deck) {
        if (err) {
            return handleError(res, err);
        }
        if (!deck) {
            return res.send(404);
        }
        deck.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
