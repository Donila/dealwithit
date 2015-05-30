'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
    type: {
        type: String,
        enum: ['Article', 'Comment']
    },
    added: { type: Date, default: Date.now },
    value: { type: Number, min: 0, max: 5 },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    source: Schema.Types.ObjectId
});

// Validate that user do not vote twice for 1 thing
RatingSchema.pre('save', function(next) {
    var self = this;
    this.constructor.findOne({source: self.source, addedBy: self.addedBy}, function(err, rating) {
        if((err || rating) && (!rating._doc._id)) {
            return next(new Error('Already voted.'));
        }
        next();
    });
});

module.exports = mongoose.model('Rating', RatingSchema);
