#! /usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drun = require('../lib/drun.js');

var _drun2 = _interopRequireDefault(_drun);

var _yargs = require('yargs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// console.log('yargs', {argv})
var promise = (0, _drun2.default)(_yargs.argv._[0], _yargs.argv._[1]).catch(function (c) {
  return process.exit(c);
});

// test purposes
exports.default = promise;