'use strict';

angular.module('dealwithitApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/hs/cards', {
        templateUrl: 'app/cards/cards.html',
        controller: 'CardsCtrl'
      });
  });
