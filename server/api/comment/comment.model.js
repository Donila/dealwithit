'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: String,
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    added: Date,
    article: { type: Schema.Types.ObjectId, ref: 'Article' },
    likes: Number,
    dislikes: Number,
    approved: Boolean
});

module.exports = mongoose.model('Comment', CommentSchema);
