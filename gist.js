var request = require("request"),
    config = require("./config");

var Gist = {};

// Load this from config.json
var options = config;

// Make a request for the specified Gist.
// If it contains files with the right name, load them into the editor.
// If it, at least, contains files with the right extensions, load them.
Gist.getMap = function(id, fn) {
  if(!id) {
    return fn("No ID");
  }

  // Set up the request
  request.get({url:options.url+options.path+'/' + id, qs: options.qs, headers: {"user-agent": "github/thingsinjars/map-playground"}}, function(e, r, chunk){
    var i;
        if (e) {
          return fn(e);
        }
        chunk = JSON.parse(chunk);

        var retrievedMap = {
          "css": "",
          "js": "",
          "html": ""
        };

        if(chunk.files) {
          if(chunk.files["jhere.css"]) {
            retrievedMap.css = chunk.files["jhere.css"].content;
          } else {
            retrievedMap.css = findChunk(chunk.files, 'css');
          }
          if(chunk.files["jhere.js"]) {
            retrievedMap.js = chunk.files["jhere.js"].content;
          } else {
            retrievedMap.js = findChunk(chunk.files, 'js');
          }
          if(chunk.files["jhere.html"]) {
            retrievedMap.html = chunk.files["jhere.html"].content;
          } else {
            retrievedMap.html = findChunk(chunk.files, 'html');
          }
        }
        fn(null, retrievedMap);

  });
};

function findChunk(files, filetype) {
  var i, r = new RegExp('\\.' + filetype + '$');
  for(i in files) {
    if(files.hasOwnProperty(i)) {
      if(r.test(i)) {
        return files[i].content;
      }
    }
  }
  return '';
}

// Save the current map code to an anoymous gist and return the new ID
Gist.setMap = function(params, fn) {
  if(!params.html && !params.css && !params.js) {
    return fn('JHERE :: No data');
  }
  var gist_description = params.html.match(/<title>([^<]*)<\/title>/);

  gist_description = gist_description ? gist_description[1] : "Map created with jHERE";

  var post_data;
  post_data = {
    "description": gist_description,
    "public": true,
    "files": {}
  };

  if(params.html && params.html !== '') {
    post_data.files['jhere.html'] = {
      "content": params.html
    };
  }
  if(params.css && params.css !== '') {
    post_data.files['jhere.css'] = {
      "content": params.css
    };
  }
  if(params.js && params.js !== '') {
    post_data.files['jhere.js'] = {
      "content": params.js
    };
  }

  request({url:options.url+options.path, method: "POST", qs: options.qs, headers: {"user-agent": "github/thingsinjars/map-playground"}, json:true, body:post_data}, function(e, r, chunk) {
    if(chunk) {
      fn(null, chunk.id);
    } else {
      fn("No response", chunk);
    }
  });
};

module.exports = Gist;