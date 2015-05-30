'use strict';

var _ = require('lodash');
var Rating = require('./rating.model');

// Get list of ratings
exports.index = function(req, res) {
  Rating.find(function (err, ratings) {
    if(err) { return handleError(res, err); }
    return res.json(200, ratings);
  });
};

// Get comments for article by articleId
exports.show = function (req, res) {
    Rating.find()
        .where({'source': req.params.id})
        .exec(function(err, comments) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, comments);
        });
};

// Creates a new rating in the DB.
exports.create = function(req, res) {
  Rating.create(req.body, function(err, rating) {
    if(err) { return handleError(res, err); }
    return res.json(201, rating);
  });
};

// Updates an existing rating in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Rating.findById(req.params.id, function (err, rating) {
    if (err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    var updated = _.merge(rating, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, rating);
    });
  });
};

// Deletes a rating from the DB.
exports.destroy = function(req, res) {
  Rating.findById(req.params.id, function (err, rating) {
    if(err) { return handleError(res, err); }
    if(!rating) { return res.send(404); }
    rating.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.json(500, err);
}
