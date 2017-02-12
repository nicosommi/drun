'use strict';

var _mocha = require('mocha');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('Drun CLI test', function () {
  (0, _mocha.describe)('default', function () {
    (0, _mocha.beforeEach)(function beforeEachBody() {
      this.drunSpy = (0, _expect.createSpy)().andReturn(Promise.resolve());
      this.mocks = {
        process: {
          exit: function exit() {
            return Promise.resolve();
          }
        },
        '../lib/drun.js': {
          default: this.drunSpy
        },
        'yargs': {
          'argv': {
            _: ['param1', 'param2']
          }
        }
      };
      this.module = (0, _proxyquire2.default)('./drun.js', this.mocks).default;

      return this.module;
    });

    (0, _mocha.it)('call drun with the right parameters', function testBody() {
      (0, _expect2.default)(this.drunSpy).toHaveBeenCalledWith('param1', 'param2');
    });
  });
});