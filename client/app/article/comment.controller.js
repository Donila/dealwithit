'use strict';

angular.module('dealwithitApp')
    .controller('CommentCtrl', function ($scope, $http, $routeParams, $location, Auth, socket) {
        var articleId = '';
        $scope.newComment = {};

        $scope.moment = moment;

        if($routeParams && $routeParams.id) {
            articleId = $routeParams.id;
            $scope.newComment.article = articleId;
            $http.get('/api/comments/' + articleId).then(function(result) {
                $scope.comments = result.data;
                socket.syncUpdates('comment', $scope.comments);
            });
        }

        $scope.me = Auth.getCurrentUser();
        $scope.isAdmin = Auth.isAdmin();

        $scope.addDisabled = false;

        $scope.addComment = function() {
            $scope.newComment.addedBy = $scope.me._id;
            $scope.newComment.added = new Date;

            $http.post('/api/comments', $scope.newComment);

            $scope.addDisabled = true;
        };

        $scope.removeComment = function(comment) {
            $http.delete('/api/comments/' + comment._id);
        };
    });
