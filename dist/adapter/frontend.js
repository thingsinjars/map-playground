/*
 * Returns HTML layouts to either embed a map or show it in the editor
 *
 * Provides:
 *   embed(req, reply)
 *   edit(req, reply)
 */

'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function adapter(server, gist, utils, Config) {
    var editorLayout = _fs2['default'].readFileSync('./templates/editor.html', 'utf-8');
    var defaults = {
        html: _fs2['default'].readFileSync('./templates/default.html', 'utf-8'),
        js: _fs2['default'].readFileSync('./templates/default.js', 'utf-8'),
        css: _fs2['default'].readFileSync('./templates/default.css', 'utf-8')
    };

    function embed(req, reply) {
        // Load the gist and render the template
        gist.getMap(req.params.key).then(utils.formatSectionsIntoPage).then(reply)['catch'](function (err) {
            return errorHandler(err, reply);
        });
    }

    function edit(req, reply) {
        // Load the gist and render the template
        gist.getMap(req.params.key).then(prepareEditView).then(reply)['catch'](function (err) {
            return errorHandler(err, reply);
        });
    }

    function create(req, reply) {
        // Load the gist and render the template
        loadDefaultTemplate().then(prepareEditView).then(reply)['catch'](function (err) {
            return errorHandler(err, reply);
        });
    }

    function errorHandler(err, reply) {
        loadDefaultTemplate().then(showEmbedTemplate).then(reply)['catch'](function (err) {
            reply({}).code(501);
        });
    }

    function prepareEditView(mapData) {
        var editLayout = editorLayout.replace('{{HTML}}', mapData.html);
        editLayout = editLayout.replace('{{JAVASCRIPT}}', mapData.js);
        editLayout = editLayout.replace('{{CSS}}', mapData.css);
        return editLayout;
    }

    function loadDefaultTemplate() {
        return new _Promise(function (resolve, reject) {
            resolve(defaults);
        });
    }

    return {
        embed: embed, edit: edit, create: create
    };
}

exports['default'] = adapter;
module.exports = exports['default'];