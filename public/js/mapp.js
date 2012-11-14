var MAPP = {
	editors: {}
};

$.fn.inject = function(content) {
	return $(this).filter("iframe").each(function() {
		var doc = this.contentDocument || this.document || this.contentWindow.document;
		doc.open();
		doc.writeln(content);
		doc.close();
	});
}


$('textarea').each(function() {
	var mode = $(this).attr('lang');
	MAPP.editors[mode] = CodeMirror.fromTextArea(this, {
		theme: 'jhere',
		mode: mode,
		onChange: function() {
			updateTextAreas();
			$('#view-gist').hide();
			$('#save-to-gist').show();
			timedRefresh();
		}
	});
});

var updateTextAreas = function() {
		MAPP.editors.html.save();
		MAPP.editors.javascript.save();
		MAPP.editors.css.save();
	};

var timedRefresh = function() {
	if(!MAPP.refreshTimer) {
		MAPP.refreshTimer = setTimeout(insertHtml, 300);
	}
};

var insertHtml = function() {
	MAPP.refreshTimer = false;
	var outputHtml = MAPP.editors.html.getTextArea().value,
		outputCss = MAPP.editors.css.getTextArea().value,
		outputScript = MAPP.editors.javascript.getTextArea().value,
		outputFrame = $('#output iframe');

	$('#output').append(outputFrame);

	outputFrame.inject(outputHtml.replace('</body>', '<script>'+outputScript+'</script></body>'));
	MAPP.contents = outputFrame.contents();

	MAPP.styleTag = $('<style/>').attr('id', 'our_css').appendTo(MAPP.contents.find('head'));
	MAPP.styleTag.text(MAPP.editors.css.getTextArea().value);
};


(function() {
	updateTextAreas();
	timedRefresh();
	if(/\/\d+/.test(window.location.pathname)) {
		$('#view-gist').attr('href', 'https://gist.github.com/'+window.location.pathname.match(/\d+/)).show();
		$('#save-to-gist').hide();
	}
})();

$('#show-other').on('click', function(e) {
	e.preventDefault();
	$('body').toggleClass('show-other');
});

$('#save-to-gist').on('click', function(e) {
	$('<div>').addClass('loader').appendTo('body');
	e.preventDefault();
	updateTextAreas();
	var data = {
		"html": MAPP.editors.html.getTextArea().value,
		"js": MAPP.editors.javascript.getTextArea().value,
		"css": MAPP.editors.css.getTextArea().value
	};
	$.post("/save", data, function(data, textStatus) {
		window.location = '/' + data.id;
	});
});

$('#download').on('click', function(e) {
	e.preventDefault();
	updateTextAreas();
	var f = $('<form action="download" method="post" target="download_target">');

	if($('#download_target').length === 0) {
		var d = $('<iframe id="download_target">').appendTo('body');
	}

	$('<input name="html">').val(MAPP.editors.html.getTextArea().value).appendTo(f);
	$('<input name="js">').val(MAPP.editors.javascript.getTextArea().value).appendTo(f);
	$('<input name="css">').val(MAPP.editors.css.getTextArea().value).appendTo(f);

	f.submit();
});

$('#single-panel a').on('click', function(e) {
	e.preventDefault();
	$target = $(this).attr('href');
	$('#html').hide();
	$('#css').hide();
	$('#other').hide();
	$('#output').hide();
	$('#js').hide();
	$($target).show();
	if(($target === "#css") || ($target === "#html")) {
		$('#other').show();
	}
});
$(window).on('resize', function() {
	if($(window).width() >= 1010) {
		$('#html').show();
		$('#css').show();
		$('#other').show();
		$('#output').show();
		$('#js').show();
	} else {
		$('#html').hide();
		$('#css').hide();
		$('#other').hide();
		$('#js').hide();
		$('#output').show();
	}
});