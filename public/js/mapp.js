var MAPP = {
	editors: {}
};

// Initialise CodeMirror on each of the textareas
$('textarea').each(function() {
	var mode = $(this).attr('lang');
	MAPP.editors[mode] = CodeMirror.fromTextArea(this, {
		theme: 'jhere',
		mode: mode,
		onChange: function() {
			updateTextAreas();
			// $('#view-gist').hide();
			$('body').removeClass('gist-viewable');
			$('body').addClass('gist-saveable');
			// $('#save-to-gist').show();
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
	if(!MAPP.refreshTimer) {
		MAPP.refreshTimer = setTimeout(insertHtml, 300);
	}
}

// A really handy plugin by Michael Mahemoff
// http://mini.softwareas.com/jquery-iframe-inject-mini-plugin
$.fn.inject = function(content) {
	return $(this).filter("iframe").each(function() {
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

	outputFrame.inject(outputHtml.replace('</body>', '<script>' + outputScript + '</script></body>'));
	MAPP.contents = outputFrame.contents();

	MAPP.styleTag = $('<style/>').attr('id', 'our_css').appendTo(MAPP.contents.find('head'));
	MAPP.styleTag.text(MAPP.editors.css.getTextArea().value);
}

// Initialise the page.
(function() {
	updateTextAreas();
	timedRefresh();

	// If we're showing an unmodified gist on load, show the 'View' button
	if(/\/\d+/.test(window.location.pathname)) {
		$('body').addClass('gist-viewable');
		$('body').removeClass('gist-saveable');
		$('#view-gist').attr('href', 'https://gist.github.com/' + window.location.pathname.match(/\d+/));
		// $('#view-gist').attr('href', 'https://gist.github.com/' + window.location.pathname.match(/\d+/)).show();
		// $('#save-to-gist').hide();
	}
})();

// Toggle visibility of the HTML/CSS tabs.
$('#show-other').on('click', function(e) {
	e.preventDefault();
	$('body').toggleClass('show-other');
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
	$.post("/save", data, function(data, textStatus) {
		window.location = '/' + data.id;
	});
});

// Copy the editors into a form and submit it to an iframe
// which will generate the downloadable file
$('#download').on('click', function(e) {
	e.preventDefault();
	updateTextAreas();
	var f = $('<form action="download" method="post" target="download_target">');

	if($('#download_target').length === 0) {
		var d = $('<iframe id="download_target">').appendTo('body');
	}

	$('<input name="html">').val(MAPP.editors.htmlmixed.getTextArea().value.replace(/\n/g,'\\n')).appendTo(f);
	$('<input name="js">').val(MAPP.editors.javascript.getTextArea().value.replace(/\n/g,'\\n')).appendTo(f);
	$('<input name="css">').val(MAPP.editors.css.getTextArea().value.replace(/\n/g,'\\n')).appendTo(f);

	f.submit();
});

// Switch between full and compact (tabbed) mode
$(window).on('resize', function() {
	if($(window).width() >= 1010) {
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
	if((target === "#css") || (target === "#html")) {
		$('#other').show();
	}
});