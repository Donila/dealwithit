'use strict';

var _ = require('lodash');
var Comment = require('./comment.model');

// Get list of comments
exports.index = function (req, res) {
    Comment.find(function (err, comments) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, comments);
    });
};

// Get comments for article by articleId
exports.show = function (req, res) {
    Comment.find()
        .where({'article': req.params.id})
        .populate('addedBy')
        .exec(function(err, comments) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, comments);
        });
};

// Get comments for article by articleId
exports.count = function (req, res) {
    Comment.count({'article': req.params.id}, function(err, comments) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, {id: req.params.id, commentsCount: comments});
    });
};

// Creates a new comment in the DB.
exports.create = function (req, res) {
    Comment.create(req.body, function (err, comment) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, comment);
    });
};

// Updates an existing comment in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Comment.findById(req.params.id, function (err, comment) {
        if (err) {
            return handleError(res, err);
        }
        if (!comment) {
            return res.send(404);
        }
        var updated = _.merge(comment, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, comment);
        });
    });
};

// Deletes a comment from the DB.
exports.destroy = function (req, res) {
    Comment.findById(req.params.id, function (err, comment) {
        if (err) {
            return handleError(res, err);
        }
        if (!comment) {
            return res.send(404);
        }
        comment.remove(function (err) {
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
