'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    name: String,
    description: String,
    imageUrl: String,
    body: String,
    tags: [String],
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    author: String,
    added: Date,
    updated: Date,
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Article', ArticleSchema);
