'use strict';

angular.module('dealwithitApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/article', {
                templateUrl: 'app/article/article.html',
                controller: 'ArticleCtrl'
            }).when('/article/:name', {
                templateUrl: 'app/article/articleView.html',
                controller: 'ArticleCtrl'
            });
    });
