'use strict';

var _promise = require('./promise.js');

var _promise2 = _interopRequireDefault(_promise);

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Promise', function () {
  it('should have utility methods', function () {
    (0, _expect2.default)(_promise2.default.map).toBeA('function');
  });
});