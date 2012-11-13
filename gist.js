var request = require("request"),
    config = require("./config");

var Gist = {};

// Load this from config.json
var options = config;

// Make a request for the specified Gist. 
// If it contains files with the right name, load them into the editor.
Gist.getMap = function(id, fn) {
  if(!id) {
    return fn("No ID");
  }

  // Set up the request
  request.get({url:options.url+options.path+'/' + id, qs: options.qs}, function(e, r, chunk){
        chunk = JSON.parse(chunk);

        var retrievedMap = {
          "css": "",
          "js": "",
          "html": ""
        };
        if(chunk.files) {
          if(chunk.files["jhere.css"]) {
            retrievedMap.css = chunk.files["jhere.css"].content;
          }
          if(chunk.files["jhere.js"]) {
            retrievedMap.js = chunk.files["jhere.js"].content;
          }
          if(chunk.files["jhere.html"]) {
            retrievedMap.html = chunk.files["jhere.html"].content;
          }
        }
        fn(null, retrievedMap);

  });
};

// Save the current map code to an anoymous gist and return the new ID
Gist.setMap = function(params, fn) {
  if(!params.html && !params.css && !params.javascript) {
    return fn('JHERE :: No data');
  }
  var gist_description = params.html.match(/<title>([^<]*)<\/title>/);

  gist_description = gist_description ? gist_description[1] : "Map created with jHERE";

  var post_data;
  post_data = {
    "description": gist_description,
    "public": true,
    "files": {
      "jhere.html": {
        "content": params.html
      },
      "jhere.css": {
        "content": params.css
      },
      "jhere.js": {
        "content": params.js
      }
    }
  };

  request({url:options.url+options.path, method: "POST", qs: options.qs, json:true, body:post_data}, function(e, r, chunk) {
    if(chunk) {
      fn(null, chunk.id);
    } else {
      fn("No response", chunk);
    }
  });
};

module.exports = Gist;