'use strict';

angular.module('dealwithitApp')
    .controller('ArticleCtrl', function ($scope, $http, Auth) {
        $scope.addedMessage = '';

        $scope.me = Auth.getCurrentUser();

        if(!$scope.$parent.editableArticle) {
            $scope.newArticle = {
                title: '',
                body: '',
                tags: [],
                author: ''
            };

            $scope.newArticle.addedBy = $scope.me._id;

            $scope.isUpdate = false;
        } else {
            $scope.newArticle = $scope.$parent.editableArticle;
            $scope.isUpdate = true;
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

                $scope.cancel();
            } else {
                $scope.newArticle.added = date;

                $http.post('/api/articles', $scope.newArticle);

                $scope.cancel();
            }
        };

        $scope.addTag = function() {
            $scope.newArticle.tags.push($scope.tag);
            console.log($scope.newArticle.tags.length);
            $scope.tag = '';
        };

        $scope.getSubmitText = function() {
            if($scope.isUpdate) {
                return 'Обновить статью';
            } else {
                return 'Добавить статью';
            }
        };

        $scope.cancel = function() {
            $scope.$emit('article:edit:cancel');
        };

        $scope.delete = function() {
            if($scope.newArticle._id) {
                $http.delete('/api/articles/' + $scope.newArticle._id);
                $scope.cancel();
            }
        };
    });
