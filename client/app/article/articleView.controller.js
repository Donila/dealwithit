'use strict';

angular.module('dealwithitApp')
    .controller('ArticleViewCtrl', function ($scope, $http, $routeParams, Auth, socket) {
        $scope.alreadyVoted = 'Ваш голос учтен';

        var DECIMAL_PLACES = 3;

        $scope.articleId = '';

        $scope.me = Auth.getCurrentUser();
        
        $scope.isLoggedIn = Auth.isLoggedIn();

        $scope.isReadonlyRating = false;

        if($routeParams && $routeParams.id) {
            $scope.articleId = $routeParams.id;
            $http.get('/api/articles/' + $scope.articleId).then(function(result) {
                $scope.article = result.data;
            });

            $http.get('/api/ratings/' + $scope.articleId).then(function(result) {
                $scope.ratings = result.data;
                $scope.averageRating =calculateAverageRating($scope.ratings);
                socket.syncUpdates('rating', $scope.ratings);
                var myRating = _.findWhere($scope.ratings, { addedBy: $scope.me._id });
                if(myRating) {
                    $scope.rate = myRating;
                    $scope.isReadonlyRating = true;
                } else {
                    $scope.rate = {
                        value: 0
                    };
                }
            });
        }

        var calculateAverageRating = function(ratings) {
            var sum = 0;
            _.each(ratings, function(rating) {
                sum += rating.value;
            });

            return (sum / ratings.length).toFixed(DECIMAL_PLACES);
        };

        $scope.saveRating = function() {
            if(!$scope.voted) {
                if($scope.articleId) {
                    if(!$scope.rate._id) {
                        // create
                        $scope.rate.addedBy = $scope.me._id;
                        $scope.rate.source = $scope.articleId;

                        $http.post('/api/ratings', $scope.rate).then(function(result) {
                            $scope.rate = result.data;
                        });

                        $scope.voted = true;
                    } else {
                        // update
                        $http.put('/api/ratings/' + $scope.rate._id, $scope.rate).then(function(result) {
                            $scope.rate = result.data;
                        });

                        $scope.voted = true;
                    }
                }
            }
        };

        $scope.revote = function() {
            $scope.voted = false;
        };

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };
    });
