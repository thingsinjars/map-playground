/*
 * Manages saving to and retrieving data from Github
 *
 * Provides:
 *   getMap(id)
 *   setMap(mapData)
 */
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentPromise = require('superagent-promise');

var _superagentPromise2 = _interopRequireDefault(_superagentPromise);

var request = (0, _superagentPromise2['default'])(_superagent2['default'], _Promise);

function adapter(Config) {

    function getMap(gistId) {
        if (!gistId) {
            return _Promise.reject("No ID");
        }
        return request.get(Config.url + Config.path + '/' + gistId).query(Config.qs).set("user-agent", "github/thingsinjars/map-playground").end().then(parseGist)['catch'](function (err) {
            return console.error;
        });
    }

    function parseGist(response) {
        var retrievedMap = {
            "css": "",
            "js": "",
            "html": ""
        };

        if (response.body && response.body.files) {
            if (response.body.files["jhere.css"]) {
                retrievedMap.css = response.body.files["jhere.css"].content;
            } else {
                retrievedMap.css = findChunk(response.body.files, 'css');
            }
            if (response.body.files["jhere.js"]) {
                retrievedMap.js = response.body.files["jhere.js"].content;
            } else {
                retrievedMap.js = findChunk(response.body.files, 'js');
            }
            if (response.body.files["jhere.html"]) {
                retrievedMap.html = response.body.files["jhere.html"].content;
            } else {
                retrievedMap.html = findChunk(response.body.files, 'html');
            }
        }
        return retrievedMap;
    }

    function findChunk(files, filetype) {
        var i,
            r = new RegExp('\\.' + filetype + '$');
        for (i in files) {
            if (files.hasOwnProperty(i)) {
                if (r.test(i)) {
                    return files[i].content;
                }
            }
        }
        return '';
    }

    function setMap(mapData) {
        if (!mapData.html && !mapData.css && !mapData.js) {
            return fn('JHERE :: No data');
        }
        var gist_description = mapData.html.match(/<title>([^<]*)<\/title>/);

        gist_description = gist_description ? gist_description[1] : "Map created with jHERE";

        var postBody = {
            "description": gist_description,
            "public": true,
            "files": {}
        };

        if (!!mapData.html) {
            postBody.files['jhere.html'] = {
                "content": mapData.html
            };
        }
        if (!!mapData.css) {
            postBody.files['jhere.css'] = {
                "content": mapData.css
            };
        }
        if (!!mapData.js) {
            postBody.files['jhere.js'] = {
                "content": mapData.js
            };
        }
        return request.post(Config.url + Config.path).query(Config.qs).set("user-agent", "github/thingsinjars/map-playground").send(postBody).end().then(function (data) {
            return data.header.location.replace('https://api.github.com/gists/', '');
        })['catch'](function (err) {
            return console.log;
        });
    };

    return {
        getMap: getMap, setMap: setMap
    };
}

exports['default'] = adapter;
module.exports = exports['default'];