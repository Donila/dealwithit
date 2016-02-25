'use strict';

angular.module('dealwithitApp')
    .controller('MainCtrl', function ($scope, $http, socket, Auth) {
        $http.get('/api/articles').success(function (articles) {
            $scope.articles = articles;
            socket.syncUpdates('article', $scope.articles);
        });

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('article');
        });

        $scope.showDate = function(date) {
            return moment(date).format('Do MMMM YYYY в hh:mm');
        };

        $scope.fromNow = function(date) {
            return moment(date).fromNow();
        };

        $scope.isAdmin = function() {
            return Auth.isAdmin();
        };

        $scope.showArticle = null;

        $scope.isShowCommentsCount = function(article) {
            if(!$scope.showArticle) {
                return false;
            }
            return $scope.showArticle._id === article._id;
        };

        $scope.showCommentsCount = function(article) {
            if($scope.showArticle && $scope.showArticle._id === article._id) {
                $scope.showArticle = null;
            } else {
                if(!_.isNumber(article.commentsCount)) {
                    $http.get('api/comments/' + article._id + '/count').then(function(result) {
                        var found = _.findWhere($scope.articles, { _id: result.data.id });
                        found.commentsCount = result.data.commentsCount;
                    });
                }

                $scope.showArticle = article;
            }
        };
    });
