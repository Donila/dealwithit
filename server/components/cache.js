var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({store: 'memory', max: 100, ttl: 10/*seconds*/});
var ttl = 5;
var q = require('q');

exports.set = function(key, value, cb) {
    memoryCache.set(key, value, {ttl: ttl}, function(err) {
        if (err) { throw err; }

        if(cb) {
            cb();
        }
    });
};

exports.get = function(key) {
    var deferred = q.defer();

    memoryCache.get(key, function(value) {
        deferred.resolve(value);
    });

    return deferred.promise;
};


