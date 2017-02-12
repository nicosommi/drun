'use strict';

var _log = require('./log.js');

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _log2.default)('test');

describe('log', function () {
  it('should log', function () {
    return logger.log({}, 'to.my.value');
  });
});