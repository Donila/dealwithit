'use strict';

angular.module('dealwithitApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/admin/cards', {
        templateUrl: 'app/admin/cards.html',
        controller: 'AdminCardsCtrl'
      });
  });