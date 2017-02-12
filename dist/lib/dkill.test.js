'use strict';

var _mocha = require('mocha');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('dkill', function () {
  (0, _mocha.describe)('default', function () {
    (0, _mocha.beforeEach)(function beforeEachBody() {
      this.spawnSpy = (0, _expect.createSpy)().andReturn({
        on: function on(name, cb) {
          if (name === 'close') {
            cb();
          }
        }
      });
      this.dkillSpy = (0, _expect.createSpy)().andReturn(Promise.resolve());
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        }
      };
      this.module = (0, _proxyquire2.default)('./dkill.js', this.mocks).default;

      return this.module();
    });

    (0, _mocha.it)('should call kill correctly', function testBody() {
      var actual = this.spawnSpy.calls[0].arguments.slice(0, 2);
      var expected = ['docker', ['kill', 'drun-default']];
      (0, _expect2.default)(actual).toEqual(expected);
    });
  });

  (0, _mocha.describe)('error on kill', function () {
    (0, _mocha.beforeEach)(function beforeEachBody() {
      this.spawnSpy = (0, _expect.createSpy)().andReturn({
        on: function on(name, cb) {
          if (name === 'error') {
            cb(new Error('an error'));
          }
        }
      });
      this.dkillSpy = (0, _expect.createSpy)().andReturn(Promise.resolve());
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        }
      };
      this.module = (0, _proxyquire2.default)('./dkill.js', this.mocks).default;

      return this.module('containerName').catch(function () {
        return Promise.resolve();
      });
    });

    (0, _mocha.it)('should call kill correctly', function testBody() {
      var actual = this.spawnSpy.calls[0].arguments.slice(0, 2);
      var expected = ['docker', ['kill', 'containerName']];
      (0, _expect2.default)(actual).toEqual(expected);
    });
  });
});