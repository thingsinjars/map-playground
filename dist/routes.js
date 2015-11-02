'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
function routes(server, joi, Adapter) {
    var routes = [{
        method: 'GET',
        path: '/embed/{key}',
        handler: Adapter.embed,
        config: {
            description: 'Returns a gist rendered as HTML',
            notes: 'Should be used to embed into iframes',
            tags: ['frontend'],
            validate: {
                params: {
                    key: joi.string().regex(/^[a-fA-F0-9]+$/).required()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/save',
        handler: Adapter.save,
        config: {
            description: 'Saves the given visualisation as an anonymous gist',
            notes: 'POSTs to Github',
            tags: ['backend'],
            validate: {
                payload: {
                    html: joi.string().example("<!doctype html>").required(),
                    js: joi.string().example("var a = 1;").required(),
                    css: joi.string().example("* {display: none !important}").required()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/download',
        handler: Adapter.download,
        config: {
            description: 'Returns the current visualisation as a file',
            notes: 'All files have the same name',
            tags: ['backend'],
            validate: {
                payload: {
                    html: joi.string().example("<!doctype html>").required(),
                    js: joi.string().example("var a = 1;").required(),
                    css: joi.string().example("* {display: none !important}").required()
                }
            }
        }
    }, {
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: 'static',
                redirectToSlash: false,
                index: false
            }
        }
    }, {
        method: 'GET',
        path: '/{key}',
        handler: Adapter.edit,
        config: {
            description: 'Displays a previously saved visualisation',
            notes: 'Defaults to a plain map if not key is provided',
            tags: ['frontend'],
            validate: {
                params: {
                    key: joi.string().regex(/^[a-fA-F0-9]+$/).optional()
                }
            }
        }
    }, {
        method: 'GET',
        path: '/',
        handler: Adapter.create,
        config: {
            description: 'Displays the editor with the default templates',
            notes: 'defaults loaded from /templates folder',
            tags: ['frontend']
        }
    }];

    routes.map(function (route) {
        return server.route(route);
    });
}

exports['default'] = routes;
module.exports = exports['default'];