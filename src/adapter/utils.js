let utils = {};

utils.formatSectionsIntoPage = function(mapData) {
    mapData.html = mapData.html.replace('</body>', '<script>' + mapData.js + '</script></body>');
    mapData.html = mapData.html.replace('</head>', '<style>' + mapData.css + '</style></head>');
    return Promise.resolve(mapData.html);
}

export default utils;