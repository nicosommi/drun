'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = drun;

var _child_process = require('child_process');

var _findUp = require('find-up');

var _findUp2 = _interopRequireDefault(_findUp);

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

var _dkill = require('./dkill.js');

var _dkill2 = _interopRequireDefault(_dkill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var logger = (0, _log2.default)('nicosommi.drun.core');

function massageParameter(prefix, object) {
  // console.log('massageParameter', { prefix, object })
  if (object && object !== undefined && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    var keys = Object.keys(object);
    if (keys.length > 0) {
      var _ret = function () {
        var result = [];
        keys.forEach(function (propertyName) {
          result.push('' + prefix);
          result.push(propertyName + ':' + object[propertyName]);
        });
        return {
          v: result
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    return null;
  }
  return null;
}

function drun() {
  var script = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'test';
  var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  logger.log('DRun is taking place...');
  return new Promise(function (resolve, reject) {
    var containerName = 'drun-' + container;
    (0, _dkill2.default)(containerName).catch(function () {
      return Promise.resolve();
    }).then(function () {
      logger.log('Now running container...', { containerName: containerName });
      // filter by container if provided and found
      // find package.json configuration
      var command = 'npm run ' + script;
      var currentDirectory = process.cwd();
      var packageJson = require('' + _findUp2.default.sync('package.json', { cwd: currentDirectory }));
      var containerConfiguration = {
        image: 'node:alpine',
        volumes: {},
        ports: 'random'
      };
      if (packageJson.drun && packageJson.drun[container]) {
        containerConfiguration = _extends({}, containerConfiguration, packageJson.drun[container]);
      }

      if (containerConfiguration.commandType === 'raw') {
        command = script;
      }

      // console.log('process.env.npm_config_argv', {npmconfigargv: process.env.npm_lifecycle_event, container, containerConfiguration})

      var volumesParameters = massageParameter('-v', containerConfiguration.volumes);
      if (!volumesParameters) volumesParameters = ['-v', currentDirectory + ':/src'];

      var portParameters = massageParameter('-p', containerConfiguration.ports);
      if (!portParameters) portParameters = ['-P'];

      var workingDirectory = '/src';
      if (containerConfiguration.workingDirectory) workingDirectory = containerConfiguration.workingDirectory;

      var child = (0, _child_process.spawn)('docker', ['run', '-it', '--rm', '--name', containerName, '-w', workingDirectory].concat(_toConsumableArray(portParameters), _toConsumableArray(volumesParameters), ['' + containerConfiguration.image, '/bin/sh', '-c', '' + command]), { stdio: 'inherit' });
      child.on('error', function (error) {
        reject(error);
      });
      child.on('close', function () {
        resolve();
      });
    });
  });
}