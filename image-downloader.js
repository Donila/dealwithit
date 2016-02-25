var request = require('request');
var fs = require('fs');
var options = {url: 'http://localhost/foo.pdf'};
var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dealwithit-dev');
var Cards = require('./server/api/card/card.model');

var downloaded = 0;
var failedDownload = 0;
var failedSave = 0;
var saved = 0;
var errors = [];

var printInfo = function(downloaded, saved, failedDownload, failedSave, overall) {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    console.log('downloaded: ', downloaded, ' / ', overall);
    console.log('saved: ', saved, ' / ', overall);
    console.log('');
    console.log('failed download: ', failedDownload);
    console.log('failed save: ', failedSave)
};

var alreadyDownloaded = function(card) {
    var files = fs.readdirSync(__dirname + '/client/assets/images/cards/ruRU/');

    return files.indexOf(card.cardId + '.png') > -1;
};

Cards.find({}).exec(function(err, returnedCards) {
    var cards = _.map(returnedCards, '_doc');
    var images = _.compact(_.map(cards, 'img'));

    _.each(cards, function(card) {
        if(card.img) {
            if(alreadyDownloaded(card)) {
                downloaded++;
                saved++;
            } else {
                request.get({url: card.img, encoding: 'binary'}, function(err, response, body) {
                    if(!err) {
                        console.log('OK:', response.req.path);
                        downloaded++;
                        printInfo(downloaded, saved, failedDownload, failedSave, images.length);

                        var fileName = __dirname + '/client/assets/images/cards/ruRU/' + response.req.path.substr(response.req.path.lastIndexOf('/') + 1);
                        fs.writeFile(fileName, body, 'binary', function(err) {
                            if(err) {
                                errors.push(err);
                                failedSave++;
                            } else {
                                saved++;
                            }
                            printInfo(downloaded, saved, failedDownload, failedSave, images.length);
                        });
                    } else {
                        failedDownload++;
                        printInfo(downloaded, saved, failedDownload, failedSave, images.length);
                        errors.push('Download error, ', err);
                    }
                });
            }
        }
    });
});

/*http.get(options, '/path/to/foo.pdf', function (error, result) {
    if (error) {
        console.error(error);
    } else {
        console.log('File downloaded at: ' + result.file);
    }
});*/
