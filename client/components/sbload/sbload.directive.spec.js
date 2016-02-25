'use strict';

describe('Directive: sbload', function () {

  // load the directive's module
  beforeEach(module('dealwithitApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sbload></sbload>');
    element = $compile(element)(scope);
  }));
});
