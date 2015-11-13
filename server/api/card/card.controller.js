'use strict';

var _ = require('lodash');
var Card = require('./card.model');
var Cards = require('./cards.model');
var mashape = require('../../components/hearthstone/mashape');

// Get list of cards
exports.index = function(req, res) {
    mashape.getInfo(function(info) {
        info = info.body;
        Cards.find()
            .where({'patch': info.patch })
            .exec(function(err, cards) {
                if (err) {
                    return handleError(res, err);
                }
                if(cards.length > 0) {
                    return res.json(200, cards[0]._doc.cards);
                } else {
                    mashape.get('?locale=ruRU', function(result) {
                        Cards.create({ patch: info.patch, cards: result.body }, function(err, cards) {
                            if (err) {
                                return handleError(res, err);
                            }

                            return res.json(200, result.body);
                        });
                    });
                }
            });
    })



};

// Get a couple of cards
exports.show = function(req, res) {
    if(req.url) {
        mashape.get(req.url, function(result) {
            return res.json(200, result);
        });
    } else {
        return res.json(200, {});
    }

  /*Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    return res.json(card);
  });*/
};

// Creates a new card in the DB.
exports.create = function(req, res) {
  Card.create(req.body, function(err, card) {
    if(err) { return handleError(res, err); }
    return res.json(201, card);
  });
};

// Updates an existing card in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Card.findById(req.params.id, function (err, card) {
    if (err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    var updated = _.merge(card, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, card);
    });
  });
};

// Deletes a card from the DB.
exports.destroy = function(req, res) {
  Card.findById(req.params.id, function (err, card) {
    if(err) { return handleError(res, err); }
    if(!card) { return res.send(404); }
    card.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
