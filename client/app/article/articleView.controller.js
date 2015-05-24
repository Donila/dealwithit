'use strict';

angular.module('dealwithitApp')
    .controller('ArticleViewCtrl', function ($scope, $http, $routeParams) {
        var articleId = '';
        if($routeParams && $routeParams.id) {
            articleId = $routeParams.id;
            $http.get('/api/articles/' + articleId).then(function(result) {
                $scope.article = result.data;
            });
        }
    });
