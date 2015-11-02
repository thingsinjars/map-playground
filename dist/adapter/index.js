'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
   value: true
});

var _gist = require('./gist');

var _gist2 = _interopRequireDefault(_gist);

var _frontend = require('./frontend');

var _frontend2 = _interopRequireDefault(_frontend);

var _backend = require('./backend');

var _backend2 = _interopRequireDefault(_backend);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function adapter(server, Config) {

   var gist = (0, _gist2['default'])(Config);
   var frontend = (0, _frontend2['default'])(server, gist, _utils2['default'], Config);
   var backend = (0, _backend2['default'])(server, gist, _utils2['default'], Config);

   return _Object$assign(frontend, backend);
}

exports['default'] = adapter;
module.exports = exports['default'];