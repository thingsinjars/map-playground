'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _good = require('good');

var _good2 = _interopRequireDefault(_good);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _lout = require('lout');

var _lout2 = _interopRequireDefault(_lout);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _adapter = require('./adapter');

var _adapter2 = _interopRequireDefault(_adapter);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

require("babel/polyfill");

var ENV = process.env.NODE_ENV || "dev";

var server = new _hapi2['default'].Server();
server.connection({
    routes: {
        cors: true
    },
    port: process.env.PORT || _config2['default'].port || 3000,
    host: '0.0.0.0'
});

var adapter = (0, _adapter2['default'])(server, _config2['default']);

var loggingOptions = {
    opsInterval: 1000,
    requestHeaders: true,
    requestPayload: true,
    responsePayload: false,
    reporters: [{
        reporter: 'good-console',
        events: {
            log: '*',
            response: '*',
            error: '*'
        }
    }]
};
if (ENV === "qa") {
    loggingOptions.reporters.push({
        reporter: require('good-apache-log'),
        events: {
            response: '*'
        },
        config: {
            file: '/var/log/node-apps/' + _config2['default'].name + '/access.log',
            format: "%h:%{remote}p %t \"%r\" %>s %F %D %I %O %b \"%{Referer}i\" \"%{User-agent}i\" \"%{Host}i\" \"%{X-Forwarded-For}i\" \"%{X-Forwarded-Port}i\" \"%{X-Forwarded-Proto}i\" \"%{X-Served-By}o\" \"%{X-NLP-TID}o\""
        }
    });
}

server.register([{
    register: _vision2['default']
}, {
    register: _inert2['default']
}, {
    register: _lout2['default']
}, {
    register: _good2['default'],
    options: loggingOptions
}], function (err) {
    if (err) {
        console.error(err);
    } else {
        server.start(function () {
            (0, _routes2['default'])(server, _joi2['default'], adapter);
            console.log('Server started at: ' + server.info.uri); // jshint ignore:line
        });
    }
});