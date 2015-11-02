require("babel/polyfill");
import Hapi from 'hapi';
import good from 'good';
import joi from 'joi';
import lout from 'lout';
import inert from 'inert';
import vision from 'vision';

import config from './config';
import Adapter from './adapter';
import routes from './routes';

const ENV = process.env.NODE_ENV || "dev";

const server = new Hapi.Server();
server.connection({
    routes: {
        cors: true
    },
    port: process.env.PORT || config.port || 3000,
    host: '0.0.0.0'
});

const adapter = Adapter(server, config);

let loggingOptions = {
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
            file: '/var/log/node-apps/' + config.name + '/access.log',
            format: "%h:%{remote}p %t \"%r\" %>s %F %D %I %O %b \"%{Referer}i\" \"%{User-agent}i\" \"%{Host}i\" \"%{X-Forwarded-For}i\" \"%{X-Forwarded-Port}i\" \"%{X-Forwarded-Proto}i\" \"%{X-Served-By}o\" \"%{X-NLP-TID}o\""
        }
    });
}

server.register([{
    register: vision
}, {
    register: inert
}, {
    register: lout
}, {
    register: good,
    options: loggingOptions
}], err => {
    if (err) {
        console.error(err);
    } else {
        server.start(() => {
            routes(server, joi, adapter);
            console.log('Server started at: ' + server.info.uri); // jshint ignore:line
        });
    }
});
