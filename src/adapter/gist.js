/*
 * Manages saving to and retrieving data from Github
 *
 * Provides:
 *   getMap(id)
 *   setMap(mapData)
 */
import superagent from 'superagent';
import promisify from 'superagent-promise';
const request = promisify(superagent, Promise);

function adapter(Config) {

    function getMap(gistId) {
        if (!gistId) {
            return Promise.reject("No ID");
        }
        return request
            .get(Config.url + Config.path + '/' + gistId)
            .query(Config.qs)
            .set("user-agent", "github/thingsinjars/map-playground")
            .end()
            .then(parseGist)
            .catch(err => console.error);
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
        return retrievedMap
    }

    function findChunk(files, filetype) {
        var i, r = new RegExp('\\.' + filetype + '$');
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
        let gist_description = mapData.html.match(/<title>([^<]*)<\/title>/);

        gist_description = gist_description ? gist_description[1] : "Map created with jHERE";

        let postBody = {
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
        return request
            .post(Config.url + Config.path)
            .query(Config.qs)
            .set("user-agent", "github/thingsinjars/map-playground")
            .send(postBody)
            .end()
            .then(data => data.header.location.replace('https://api.github.com/gists/',''))
            .catch(err => console.log);
    };

    return {
        getMap, setMap
    };
}

export default adapter;
