'use strict';

angular.module('dealwithitApp')
    .controller('AdminCardsCtrl', function ($scope, $http, Auth) {
        $scope.patchOk = true;
        $http.get('/api/cards/info', {}).success(function(info) {
            $scope.info = info;

            var patches = _.map($scope.info.patches, 'patch');
            $scope.patchOk = patches.indexOf(info.currentPatch) > -1;
        });

        $scope.upgrade = function() {
            $scope.upgrading = true;
            $http.get('/api/cards/upgrade', {}).success(function(result) {
                $scope.upgradeResult = result;
                $scope.upgrading = false;
            }).error(function(error) {
                $scope.error = error;
                $scope.upgrading = false;
            })
        }
    });
