/*
 * Returns HTML layouts to either embed a map or show it in the editor
 *
 * Provides:
 *   embed(req, reply)
 *   edit(req, reply)
 */

import fs from 'fs';
function adapter(server, gist, utils, Config) {
    const editorLayout = fs.readFileSync('./templates/editor.html', 'utf-8');
    const defaults = {
        html: fs.readFileSync('./templates/default.html', 'utf-8'),
        js: fs.readFileSync('./templates/default.js', 'utf-8'),
        css: fs.readFileSync('./templates/default.css', 'utf-8')
    };

    function embed(req, reply) {
        // Load the gist and render the template
        gist.getMap(req.params.key)
            .then(utils.formatSectionsIntoPage)
            .then(reply)
            .catch(err => errorHandler(err, reply));
    }

    function edit(req, reply) {
        // Load the gist and render the template
        gist.getMap(req.params.key)
            .then(prepareEditView)
            .then(reply)
            .catch(err => errorHandler(err, reply));
    }

    function create(req, reply) {
        // Load the gist and render the template
        loadDefaultTemplate()
            .then(prepareEditView)
            .then(reply)
            .catch(err => errorHandler(err, reply));
    }

    function errorHandler(err, reply) {
        loadDefaultTemplate()
            .then(showEmbedTemplate)
            .then(reply)
            .catch(err => {
                reply({}).code(501);
            })
    }

    function prepareEditView(mapData) {
        let editLayout = editorLayout.replace('{{HTML}}', mapData.html);
        editLayout = editLayout.replace('{{JAVASCRIPT}}', mapData.js);
        editLayout = editLayout.replace('{{CSS}}', mapData.css);
        return editLayout;
    }

    function loadDefaultTemplate() {
        return new Promise(function(resolve, reject) {
            resolve(defaults);
        });
    }

    return {
        embed, edit, create
    };
}

export default adapter;
