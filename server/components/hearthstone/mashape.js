var unirest = require('unirest');

var baseUrl = 'https://omgvamp-hearthstone-v1.p.mashape.com';

exports.get = function(url, callback) {
    unirest.get(baseUrl + '/cards' + url)
        .header('X-Mashape-Key', 'lepQkfkEqJmshTya01JnnIokI0Yop1BajoLjsntNB4uRiaPPCh')
        .header('Accept', 'application/json')
        .end(function (result) {
            callback(result);
        });
};

exports.getInfo = function(callback) {
    unirest.get(baseUrl + '/info')
        .header('X-Mashape-Key', 'lepQkfkEqJmshTya01JnnIokI0Yop1BajoLjsntNB4uRiaPPCh')
        .header('Accept', 'application/json')
        .end(function (result) {
            callback(result);
        });
};
