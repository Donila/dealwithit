'use strict';

describe('Controller: CardsCtrl', function () {

  // load the controller's module
  beforeEach(module('dealwithitApp'));

  var CardsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardsCtrl = $controller('CardsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
