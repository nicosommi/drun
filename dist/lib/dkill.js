'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dkill;

var _child_process = require('child_process');

var _log = require('./utils/log');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _log2.default)('nicosommi.drun.dkill');

function dkill() {
  var containerName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'drun-default';

  logger.log('Ensuring no conflict with another running container...');
  return new Promise(function (resolve, reject) {
    var child = (0, _child_process.spawn)('docker', ['kill', '' + containerName], { stdio: 'inherit' });
    child.on('error', function (error) {
      reject(error);
    });
    child.on('close', function () {
      resolve();
    });
  });
}