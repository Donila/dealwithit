'use strict';

angular.module('dealwithitApp')
    .controller('ArticleCtrl', function ($scope, $http, Auth, $routeParams, $location) {
        $scope.addedMessage = '';

        $scope.me = Auth.getCurrentUser();

        if(!$routeParams || !$routeParams.id) {
            $scope.newArticle = {
                title: '',
                body: '',
                tags: [],
                author: ''
            };

            $scope.isUpdate = false;
        } else {
            $scope.loading = true;
            $http.get('/api/articles/' + $routeParams.id).then(function(result) {
                $scope.newArticle = result.data;
                $scope.loading = false;
                $scope.isUpdate = true;
            }).then(function(error) {
                $scope.loading = false;
                console.log(error);
            });
        }

        $scope.addArticle = function() {
            var date = new Date();

            $scope.newArticle.updated = date;

            if($scope.newArticle._id) {
                if($scope.newArticle.addedBy && $scope.newArticle.addedBy._id) {
                    $scope.newArticle.addedBy = $scope.newArticle.addedBy._id;
                }
                if($scope.newArticle.updatedBy && $scope.newArticle.updatedBy._id) {
                    $scope.newArticle.updatedBy = $scope.newArticle.updatedBy._id;
                } else {
                    $scope.newArticle.updatedBy = $scope.me._id;
                }
                $http.put('/api/articles/' + $scope.newArticle._id, $scope.newArticle);

                $location.path('/news/' + $scope.newArticle._id);
            } else {
                $scope.newArticle.added = date;
                $scope.newArticle.addedBy = $scope.me._id;

                $http.post('/api/articles', $scope.newArticle).then(function(result) {
                    $location.path('/news/' + result.data._id);
                }).then(function(error) {
                    console.log(error);
                    $scope.cancel();
                });
            }
        };

        $scope.addTag = function() {
            $scope.newArticle.tags.push($scope.tag);
            console.log($scope.newArticle.tags.length);
            $scope.tag = '';
        };

        $scope.removeTag = function(index) {
            $scope.newArticle.tags.splice(index, 1);
        };

        $scope.getSubmitText = function() {
            if($scope.isUpdate) {
                return 'Обновить статью';
            } else {
                return 'Добавить статью';
            }
        };

        $scope.cancel = function() {
            $location.path('/');
        };

        $scope.delete = function() {
            if($scope.newArticle._id) {
                $http.delete('/api/articles/' + $scope.newArticle._id);
                $scope.cancel();
            }
        };

        $scope.fromNow = function(date) {
            return moment(date).fromNow();
        };
    });
