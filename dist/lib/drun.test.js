'use strict';

var _mocha = require('mocha');

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _proxyquire = require('proxyquire');

var _proxyquire2 = _interopRequireDefault(_proxyquire);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _mocha.describe)('DRun', function () {
  (0, _mocha.beforeEach)(function beforeEachBody() {});

  (0, _mocha.describe)('default run', function () {
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
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      };
      this.module = (0, _proxyquire2.default)('./drun', this.mocks).default;

      return this.module();
    });

    (0, _mocha.it)('should run the specified command with a default image', function testBody() {
      var actual = this.spawnSpy.calls[0].arguments.slice(0, 2);
      var expected = ['docker', ['run', '-it', '--rm', '--name', 'drun-default', '-w', '/src', '-P', '-v', process.cwd() + ':/src', 'node:alpine', '/bin/sh', '-c', 'npm run test']];

      (0, _expect2.default)(actual).toEqual(expected);
    });
  });

  (0, _mocha.describe)('custom image configuration', function () {
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
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      };
      this.module = (0, _proxyquire2.default)('./drun', this.mocks).default;

      return this.module('mycommand', 'custom');
    });

    (0, _mocha.it)('should build the right volumes, port, etc parameters', function testBody() {
      var actual = this.spawnSpy.calls[0].arguments.slice(0, 2);
      var expected = ['docker', ['run', '-it', '--rm', '--name', 'drun-custom', '-w', '/src', '-p', '9000:80', '-v', process.cwd() + ':/src', '-v', '/home:/home', 'node', '/bin/sh', '-c', 'mycommand']];

      (0, _expect2.default)(actual).toEqual(expected);
    });
  });

  (0, _mocha.describe)('custom non interactive configuration', function () {
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
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      };
      this.module = (0, _proxyquire2.default)('./drun', this.mocks).default;
    });

    (0, _mocha.describe)('no tty no interactive', function () {
      (0, _mocha.beforeEach)(function beforeEachBody() {
        return this.module('mycommand', 'customnoitty');
      });

      (0, _mocha.it)('should build the right volumes, port, etc parameters', function testBody() {
        var actual = this.spawnSpy.calls[0].arguments.slice(0, 2)[1];
        var expected = ['run', '--rm', '--name', 'drun-customnoitty', '-w', '/src', '-P', '-v', process.cwd() + ':/src', 'node:alpine', '/bin/sh', '-c', 'npm run mycommand'];

        (0, _expect2.default)(actual).toEqual(expected);
      });
    });

    (0, _mocha.describe)('no interactive', function () {
      (0, _mocha.beforeEach)(function beforeEachBody() {
        return this.module('mycommand', 'customnoi');
      });

      (0, _mocha.it)('should build the right volumes, port, etc parameters', function testBody() {
        var actual = this.spawnSpy.calls[0].arguments.slice(0, 2)[1];
        var expected = ['run', '-t', '--rm', '--name', 'drun-customnoi', '-w', '/src', '-P', '-v', process.cwd() + ':/src', 'node:alpine', '/bin/sh', '-c', 'npm run mycommand'];

        (0, _expect2.default)(actual).toEqual(expected);
      });
    });

    (0, _mocha.describe)('no tty', function () {
      (0, _mocha.beforeEach)(function beforeEachBody() {
        return this.module('mycommand', 'customnotty');
      });

      (0, _mocha.it)('should build the right volumes, port, etc parameters', function testBody() {
        var actual = this.spawnSpy.calls[0].arguments.slice(0, 2)[1];
        var expected = ['run', '-i', '--rm', '--name', 'drun-customnotty', '-w', '/src', '-P', '-v', process.cwd() + ':/src', 'node:alpine', '/bin/sh', '-c', 'npm run mycommand'];

        (0, _expect2.default)(actual).toEqual(expected);
      });
    });
  });

  (0, _mocha.describe)('on dkill error', function () {
    (0, _mocha.beforeEach)(function beforeEachBody() {
      this.spawnSpy = (0, _expect.createSpy)().andReturn({
        on: function on(name, cb) {
          if (name === 'close') {
            cb();
          }
        }
      });
      this.dkillSpy = (0, _expect.createSpy)().andReturn(Promise.reject());
      this.mocks = {
        'child_process': {
          spawn: this.spawnSpy
        },
        './dkill.js': {
          default: this.dkillSpy
        }
      };
      this.module = (0, _proxyquire2.default)('./drun', this.mocks).default;

      return this.module('mycommand');
    });

    (0, _mocha.it)('should run the specified command anyway', function testBody() {
      var actual = this.spawnSpy.calls.length;
      var expected = 1;

      (0, _expect2.default)(actual).toEqual(expected);
    });
  });
});