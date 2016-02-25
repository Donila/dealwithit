'use strict';

angular.module('dealwithitApp')
    .controller('DecksCtrl', function ($scope, $http) {
        $http.get('/api/decks').success(function(result) {
            $scope.decks = result;
        });
    });
