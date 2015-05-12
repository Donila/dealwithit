'use strict';

angular.module('dealwithitApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/article/:id', {
                templateUrl: 'app/article/articleEdit.html',
                controller: 'ArticleCtrl',
                authenticate: true
            }).when('/article/add', {
                templateUrl: 'app/article/articleEdit.html',
                controller: 'ArticleCtrl',
                authenticate: true
            }).when('/article', {
                templateUrl: 'app/article/articleEdit.html',
                controller: 'ArticleCtrl',
                authenticate: true
            }).when('/news/:id', {
                templateUrl: 'app/article/article.html',
                controller: 'ArticleViewCtrl'
            });
    });
