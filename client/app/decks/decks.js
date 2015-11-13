'use strict';

angular.module('dealwithitApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when('/hs/decks/new/:hero', {
                templateUrl: 'app/decks/deckEdit.html',
                controller: 'DeckCtrl',
                authenticate: true
            })
            .when('/hs/decks/new', {
                templateUrl: 'app/decks/new.html',
                controller: 'DeckCtrl',
                authenticate: true
            })
            .when('/hs/decks', {
                templateUrl: 'app/decks/decks.html',
                controller: 'DecksCtrl'
            })
            .when('/hs/decks/edit/:id', {
                templateUrl: 'app/decks/deckEdit.html',
                controller: 'DeckCtrl',
                authenticate: true
            })
            .when('/hs/decks/:id', {
                templateUrl: 'app/decks/deck.html',
                controller: 'DeckCtrl'
            })
            .when('/hs/news', {
                templateUrl: 'app/decks/news.html',
                controller: 'DecksCtrl'
            });
    });
