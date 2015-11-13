'use strict';

describe('Controller: DecksCtrl', function () {

  // load the controller's module
  beforeEach(module('dealwithitApp'));

  var DecksCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DecksCtrl = $controller('DecksCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
