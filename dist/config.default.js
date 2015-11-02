"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    "url": "https://api.github.com",
    "path": "/gists",
    "qs": {
        "client_id": "{GitHub_Client_ID}",
        "client_secret": "{GitHub_Client_Secret}"
    }
};

exports["default"] = config;
module.exports = exports["default"];