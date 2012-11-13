// Maps Playground
// ===
//
// using jHere
//
// (c) 2012 Simon Madine
//
// MIT license

// Pull in modules
var express = require('express'),
    fs = require('fs'),
    gist = require('./gist');

// Create server
var app = express();

// Add in middleware for resource serving...
app.use(express.static(__dirname + '/public'));

// ...and for post method parsing
app.use(express.bodyParser());

// The URL requested contains a path
app.get('/:key?', function(req, res) {
  // If the path is just numbers, it's probably a Gist
  if(/\d+/.test(req.params.key)) {

    // Load the gist and render the template
    gist.getMap(req.params.key, function(err, data) {
      loadTemplate(req, res, data);
    });

  // In all other cases, just render the default template
  } else {
    loadDefault(req, res, loadTemplate);
  }
});

// Request to create a new gist
app.post('/save', function(req, res) {

  //Get the data out of the request
  var data = {
    "html": req.body.html,
    "js": req.body.js,
    "css": req.body.css
  };

  // Create a new gist
  gist.setMap(data, function(err, id) {
    res.json({
      result: "success",
      id: id
    });
  });
});

// Start the app listening
app.listen(3000);

// Load the default files from the local file system
function loadDefault(req, res, callback) {
  fs.readFile('./public/default/default.html', function(err, html) {
    if(err) {
      throw err;
    }
    fs.readFile('./public/default/default.js', function(err, js) {
      if(err) {
        throw err;
      }
      fs.readFile('./public/default/default.css', function(err, css) {
        if(err) {
          throw err;
        }
        callback(req, res, {
          "html":html,
          "js":js,
          "css":css
        });
      });
    });
  });
}

// Render the supplied data into the editor template
// This could be the default code
// or code retrieved from a gist
function loadTemplate(req, res, data) {
  fs.readFile('./index.html', 'utf-8', function(err, editor) {
    if(err) {
      throw err;
    }
    editor = editor.replace('{{HTML}}', data.html);
    editor = editor.replace('{{JAVASCRIPT}}', data.js);
    editor = editor.replace('{{CSS}}', data.css);
    res.writeHeader(200, {
        "Content-Type": "text/html"
    });
    res.write(editor);
    res.end();
  });
}