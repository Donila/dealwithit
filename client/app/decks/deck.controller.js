'use strict';

angular.module('dealwithitApp')
    .controller('DeckCtrl', function ($scope, $http, $routeParams, $location, Auth) {
        $scope.me = Auth.getCurrentUser();
        $scope.deck = { cards: [], name: '' };
        $scope.loading = true;

        $scope.loadingCards = true;
        $scope.cards = [];
        $scope.cardsPage = 0;
        $scope.cardsPerPage = 6;
        $scope.allCardsCount = 0;
        $scope.cardsInFilter = 0;
        $scope.filteredCards = [];
        $scope.filterType = '';
        $scope.filterText = '';

        $scope.images = [];

        var start = moment();
        console.log('start of downloading cards...');

        var includedSets = ['Basic', 'Classic', 'Naxxramas', 'Goblins vs Gnomes', 'Blackrock Mountain', 'The Grand Tournament',
            'The League of Explorers', 'Reward'];

        var basicCondition = function(card) {
            return includedSets.indexOf(card.cardSet) > -1 &&
                card.type !== 'Hero' &&
                card.type !== 'Hero Power' &&
                card.type !== 'Enchantment' &&
                !card.playerClass &&
                card.flavor;
        };

        var heroCondition = function(card) {
            return includedSets.indexOf(card.cardSet) > -1 &&
                card.type !== 'Hero' &&
                card.type !== 'Hero Power' &&
                card.type !== 'Enchantment' &&
                card.playerClass === $routeParams.hero &&
                card.flavor;
        };

        $http.get('/api/cards?locale=ruRU', { cache: true }).success(function(cards) {
            $scope.cards = cards;

            $scope.images = _.compact(_.map(cards, 'img'));

            if($routeParams.id) {
                $http.get('/api/decks/' + $routeParams.id).success(function(result) {
                    $scope.deck = result;
                    var realCards = [];
                    for(var i in result.cards) {
                        var cardObject = _.findWhere($scope.cards, { cardId: result.cards[i].cardId });

                        realCards.push({card: cardObject, count: result.cards[i].count});
                    }

                    $scope.deck.cards = realCards;

                    $scope.loading = false;
                });
            }

            console.log('cards loaded in ' + moment().diff(start, 'ms') + ' ms');

            $scope.basicCards = _.sortBy(_.where($scope.cards, function(card) {
                return basicCondition(card);
            }), 'cost');

            $scope.classCards = _.sortBy(_.where($scope.cards, function(card) {
                return heroCondition(card);
            }), 'cost');

            $scope.allCardsCount = $scope.basicCards.length;

            $scope.filterCardsForPaging();

            $scope.loadingCards = false;
        });

        $http.get('/api/cards/types/Hero?locale=enUS', { cache: true }).success(function (heroes) {
            $scope.heroes = [];
            for(var i in heroes.body) {
                var hero = heroes.body[i];
                if(hero.cardSet === 'Basic') {
                    $scope.heroes.push(hero);
                }
            }

            if($routeParams && $routeParams.hero) {
                $scope.hero = _.findWhere($scope.heroes, { playerClass: $routeParams.hero });
            }
        });

        $scope.onImgLoad = function(event, card) {
            var actualCard = _.findWhere($scope.filteredCards, { cardId: card.cardId });
            actualCard.loaded = true;
            console.log(card.cardId, 'loaded');
        };

        $scope.getCardSrc = function(card) {
            return 'assets/images/cards/ruRU/' + card.img.substr(card.img.lastIndexOf('/') + 1);
        };

        $scope.pickHero = function(hero) {
            $scope.hero = hero;
        };

        $scope.addCard = function(card) {
            $scope.deck.cards.push(card);
        };

        $scope.nextPage = function() {
            if($scope.nextEnabled()) {
                $scope.cardsPage++;
                $scope.filterCardsForPaging();
            }
        };

        $scope.prevPage = function() {
            if($scope.prevEnabled()) {
                $scope.cardsPage--;
                $scope.filterCardsForPaging();
            }
        };

        $scope.filterCardsForPaging = function() {
            var cards;
            if($scope.cardsType === 'Basic') {
                cards = $scope.basicCards;
            } else {
                cards = $scope.classCards;
            }
            if(cards) {
                var filteredCards = cards;
                $scope.allCardsCount = cards.length;
                $scope.calculatePages();
                if($scope.selectedCrystal) {
                    filteredCards = _.filter(cards, function(card) {
                        var crystals = parseInt($scope.selectedCrystal);
                        if(crystals) {
                            if(crystals > 6) {
                                return card.cost > 6;
                            }

                            return card.cost === crystals;
                        }
                    });
                }

                if($scope.filterText.length > 0) {
                    filteredCards = _.filter(filteredCards, function(card) {
                        var textToSearch = $scope.filterText.toLowerCase();
                        var foundInName = card.name.toLowerCase().indexOf(textToSearch) > -1;
                        var foundInDescription = card.flavor.toLowerCase().indexOf(textToSearch) > -1;
                        return foundInName || foundInDescription;
                    });
                }

                $scope.cardsInFilter = filteredCards.length;

                $scope.filteredCards = _.take(filteredCards.slice($scope.cardsPage * $scope.cardsPerPage), $scope.cardsPerPage);

                $scope.calculatePages();
            }
        };

        $scope.calculatePages = function() {
            $scope.pages = Math.ceil($scope.cardsInFilter/$scope.cardsPerPage);
        };

        $scope.nextEnabled = function() {
            $scope.calculatePages();
            return ($scope.cardsPage + 1) < $scope.pages;
        };

        $scope.prevEnabled = function() {
            return $scope.cardsPage > 0;
        };

        $scope.cardsType = 'Basic';
        $scope.switchCardTypes = function() {
            if($scope.cardsType !== 'Basic') {
                $scope.cardsType = 'Basic';
                $scope.cardsPage = 0;
            } else {
                $scope.cardsType = 'Hero';
                $scope.cardsPage = 0;
            }

            $scope.filterCardsForPaging();
        };

        $scope.getCardsTypesText = function() {
            if($scope.cardsType === 'Basic') {
                return 'К классовым картам';
            } else {
                return 'К базовым картам';
            }
        };

        $scope.addToDeck = function(card) {
            var cardInDeck = _.findWhere(_.pluck($scope.deck.cards, 'card'), { cardId: card.cardId });
            var foundCard = _.findWhere($scope.deck.cards, { card: card});
            if($scope.getCardsInDeckCount() > 29) {
                //alert('30 Карт уже набрано. Уберите карту из колоды чтобы добавить.');
                return;
            }

            if(cardInDeck && foundCard.count === 2) {
                //alert('Нельзя положить больше 2ух копий одинаковой карты.');
                return;
            }
            if(card.rarity === 'Legendary' && cardInDeck) {
                //alert('Нельзя положить в колоду 2 одинаковые легендарные карты.');
                return;
            }

            if(foundCard && foundCard.count === 1) {
                foundCard.count = 2;
            } else {
                $scope.deck.cards.push({card: card, count: 1});
            }

            $scope.sortDeck();
        };

        $scope.removeFromDeck = function(card) {
            var foundCard = _.findWhere($scope.deck.cards, { card: card.card });
            if(foundCard) {
                if(foundCard.count === 1) {
                    _.remove($scope.deck.cards, { card: card.card });
                }
                if(foundCard.count === 2) {
                    foundCard.count = 1;
                }
            }

            $scope.sortDeck();
        };

        $scope.getCard = function(id) {
            return _.findWhere($scope.cards, { cardId: id });
        };

        $scope.twoCards = function(card) {
            if(!card || !card.cardId) {
                return false;
            }

            return _.findWhere(_.pluck($scope.deck.cards, 'card'), { cardId: card.cardId }).count === 2;
        };

        $scope.getCardsInDeckCount = function() {
            var count = 0;
            for(var i in $scope.deck.cards) {
                count += $scope.deck.cards[i].count;
            }
            return count;
        };

        $scope.sortDeck = function() {
            $scope.deck.cards = _.sortBy($scope.deck.cards, function(card) {
                return card.card.cost;
            });
        };

        $scope.cantAddCard = function(card) {
            var foundCard = _.findWhere($scope.deck.cards, { card: card });
            if(!foundCard) {
                return false;
            }
            return foundCard.count === 2 || (foundCard.card.rarity === 'Legendary' && foundCard.count === 1);
        };

        $scope.saveDeck = function() {
            $scope.deck.author = $scope.me._id;
            $scope.deck.added = new Date();

            if($routeParams.hero) {
                $scope.deck.class = $routeParams.hero;
                $http.post('/api/decks', $scope.deck).then(function(result) {
                    console.log(JSON.stringify(result));
                    $location.path('/hs/decks/' + result.data._id);
                }).then(function(error) {
                    console.log(error);
                });
            } else {
                $http.put('/api/decks/' + $scope.deck._id, $scope.deck);
            }
        };

        $scope.hoverCard = function(card) {
            $scope.hoveredCard = card;
        };

        $scope.manacrystals = [ '0', '1', '2', '3', '4', '5', '6', '7+'];
        $scope.selectedCrystal = '';

        $scope.clickCrystal = function(crystal) {
            if($scope.selectedCrystal === crystal) {
                $scope.selectedCrystal = '';
            } else {
                $scope.cardsPage = 0;

                $scope.selectedCrystal = crystal;
            }

            $scope.filterCardsForPaging();
        };

        $scope.filterChanged = function() {
            $scope.filterCardsForPaging();
        };

        $scope.stringify = function(s) {
            return JSON.stringify(s);
        };
    });

