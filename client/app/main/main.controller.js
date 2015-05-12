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
            return moment(date).fromNow();
        };

        $scope.isAdmin = function() {
            return Auth.isAdmin();
        };
    });
