'use strict';

angular.module('dealwithitApp')
    .controller('CardsCtrl', function ($scope, $http) {
        $http.get('/api/cards/', { cache: true }).success(function (articles) {

        });
    });
