'use strict';

angular.module('dealwithitApp')
    .controller('MainCtrl', function ($scope, $http, socket, Auth) {
        $http.get('/api/articles').success(function (dotaArticles) {
            $scope.dotaArticles = dotaArticles;
            socket.syncUpdates('article', $scope.dotaArticles);
        });

        $scope.deleteThing = function (thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.articles = [];

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('article');
        });

        $scope.showDate = function(date) {
            return moment(date).fromNow();
        };

        $scope.isAdmin = function() {
            return Auth.isAdmin();
        };

        $scope.editArticle = function(article) {
            $scope.collapsedArticle = null;
            $scope.editableArticle = angular.copy(article);
        };

        $scope.addArticle = function() {
            $scope.collapsedArticle = null;
            $scope.editableArticle = null;
            $scope.addingNewArticle = true;
        };

        $scope.$on('article:edit:cancel', function() {
            $scope.editableArticle = null;
            $scope.addingNewArticle = false;
        });
    });
