'use strict';

var _ = require('lodash');
var Cards = require('./card.model');
var ExternalCards = require('./external-cards.model');
var mashape = require('../../components/hearthstone/mashape');
var migration = require('../../components/hearthstone/migration');

// Get list of cards
exports.index = function(req, res) {
	var locale = req.params.locale || 'ruRU';

    Cards.find({locale: locale}).exec(function(err, cards) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, cards);
    });
};

exports.upgrade = function(req, res) {
    var locale = 'ruRU';
    mashape.get('?locale=' + locale, function(result) {
        mashape.getInfo(function(info) {
            info = info.body;
            ExternalCards.create({ patch: info.patch, cards: result.body }, function(err, cards) {
                if (err) {
                    return handleError(res, err);
                }

                migration.fromHearthStoneApiToMongoCards(result).then(function(addedCards) {
                    var msg = 'Migration complete, cards overall: ' + addedCards.length;
                    console.log(msg);

                    return res.json(200, msg);
                });
            });
        });
    });
};

exports.info = function(req, res) {
    mashape.getInfo(function(info) {
        info = info.body;
        var returnInfo = {
            currentPatch: info.patch
        };

        ExternalCards.find()
            .select('patch')
            .exec(function(err, patches) {
                if (err) {
                    return handleError(res, err);
                }

                returnInfo.patches = patches;

                return res.json(200, returnInfo);
            });
    });
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
  Cards.create(req.body, function(err, card) {
	if(err) { return handleError(res, err); }
	return res.json(201, card);
  });
};

// Updates an existing card in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Cards.findById(req.params.id, function (err, card) {
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
  Cards.findById(req.params.id, function (err, card) {
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
