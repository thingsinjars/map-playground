'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
var utils = {};

utils.formatSectionsIntoPage = function (mapData) {
    mapData.html = mapData.html.replace('</body>', '<script>' + mapData.js + '</script></body>');
    mapData.html = mapData.html.replace('</head>', '<style>' + mapData.css + '</style></head>');
    return _Promise.resolve(mapData.html);
};

exports['default'] = utils;
module.exports = exports['default'];