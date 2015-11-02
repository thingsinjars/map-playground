var MAPP = {
    editors: {}
};

loopProtect.alias = 'protect';
loopProtect.hit = function(line) {
    alert('Potential infinite loop found on line ' + line);
};


// Initialise CodeMirror on each of the textareas
$('#js-area, #html-area, #css-area').each(function() {
    var mode = $(this).attr('lang');
    MAPP.editors[mode] = CodeMirror.fromTextArea(this, {
        theme: 'jhere',
        mode: mode,
        onChange: function() {
            updateTextAreas();
            $('body').removeClass('gist-viewable');
            $('body').removeClass('show-embed');
            $('body').addClass('gist-saveable');
            timedRefresh();
        }
    });
});

// Copy the editors into the hidden textareas


function updateTextAreas() {
    MAPP.editors.htmlmixed.save();
    MAPP.editors.javascript.save();
    MAPP.editors.css.save();
}

// The refresh is delayed so that if you're typing fast
// it doesn't update too often.


function timedRefresh() {
    if (!MAPP.refreshTimer) {
        MAPP.refreshTimer = setTimeout(insertHtml, 300);
    }
}

// A really handy plugin by Michael Mahemoff
// http://mini.softwareas.com/jquery-iframe-inject-mini-plugin
$.fn.inject = function(content) {
    return $(this).filter("iframe").each(function() {
        // rewrite the user's JavaScript to protect loops
        var win = this.contentWindow;
        win.protect = loopProtect;

        var doc = this.contentDocument || this.document || this.contentWindow.document;
        doc.open();
        doc.writeln(content);
        doc.close();
    });
};

// Combine the HTML, CSS and JS into a single file
// to display in the output frame


function insertHtml() {
    MAPP.refreshTimer = false;
    var outputHtml = MAPP.editors.htmlmixed.getTextArea().value,
        outputCss = MAPP.editors.css.getTextArea().value,
        outputScript = MAPP.editors.javascript.getTextArea().value,
        outputFrame = $('#output iframe');

    $('#output').append(outputFrame);

    var processedScript = loopProtect(outputScript);

    outputFrame.inject(outputHtml.replace('</body>', '<script>' + processedScript + '</script></body>'));
    MAPP.contents = outputFrame.contents();

    MAPP.styleTag = $('<style/>').attr('id', 'our_css').appendTo(MAPP.contents.find('head'));
    MAPP.styleTag.text(MAPP.editors.css.getTextArea().value);
}

function getBaseUrl() {
    return window.location.href.substring(0, window.location.href.lastIndexOf('/'));
}

function getGistId() {
    return window.location.href.replace(getBaseUrl() + "/", '');
}

// Initialise the page.
(function() {
    updateTextAreas();
    timedRefresh();

    // If we're showing an unmodified gist on load, show the 'View' button
    if (/^[a-fA-F0-9]+$/.test(getGistId())) {
        $('body').addClass('gist-viewable');
        $('body').removeClass('gist-saveable');
        $('#view-gist').attr('href', 'https://gist.github.com/' + window.location.pathname.match(/[0-9a-f]+/));
    }
})();

// Toggle visibility of the HTML/CSS tabs.
$('#show-other').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('show-other');
});

// Toggle visibility of the embed card
$('#embed').on('click', function(e) {
    e.preventDefault();
    if ($('body').hasClass('gist-viewable')) {
        $('#embedcopy textarea').text('<iframe src="' + getBaseUrl() + "/embed/" + getGistId() + '" width="100%" height="100%">')
    } else {
        $('#embedcopy textarea').text('The map must be saved before it can be embedded')
    }
    $('body').toggleClass('show-embed');
});

// Send the content of the editors to the server to
// save to GitHub
$('#save-to-gist').on('click', function(e) {
    $('<div>').addClass('loader').appendTo('body');
    e.preventDefault();
    updateTextAreas();
    var data = {
        "html": MAPP.editors.htmlmixed.getTextArea().value,
        "js": MAPP.editors.javascript.getTextArea().value,
        "css": MAPP.editors.css.getTextArea().value
    };
    $.post("save", data, function(data, textStatus) {
        window.location.href = getBaseUrl() + '/' + data.id;
    });
});

// Copy the editors into a form and submit it to an iframe
// which will generate the downloadable file
$('#download').on('click', function(e) {
    e.preventDefault();
    updateTextAreas();
    var f = $('<form action="download" method="post" target="download_target">');

    if ($('#download_target').length === 0) {
        var d = $('<iframe id="download_target">').appendTo('body');
    }

    $('<input name="html">').val(MAPP.editors.htmlmixed.getTextArea().value.replace(/\n/g, '\\n')).appendTo(f);
    $('<input name="js">').val(MAPP.editors.javascript.getTextArea().value.replace(/\n/g, '\\n')).appendTo(f);
    $('<input name="css">').val(MAPP.editors.css.getTextArea().value.replace(/\n/g, '\\n')).appendTo(f);

    f.submit();
});

// Switch between full and compact (tabbed) mode
$(window).on('resize', function() {
    if ($(window).width() >= 1010) {
        $('.code-tab').show();
    } else {
        $('.code-tab').hide();
        $('#output').show();
    }
});

// Show/hide tabs when we're in compact mode
$('#single-panel a').on('click', function(e) {
    e.preventDefault();
    target = $(this).attr('href');
    $('.code-tab').hide();
    $(target).show();
    if ((target === "#css") || (target === "#html")) {
        $('#other').show();
    }
});
