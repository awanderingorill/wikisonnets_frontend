'use strict';

var templates = require("./templates.js");
var currentPoem = null;

$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl =      $('<span>').hide().appendTo(document.body).css("white-space", "pre");
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width(); 
};

function throttle(f, delay){
  var timer = null;
  return function(){
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = window.setTimeout(function(){
        f.apply(context, args);
    },
    delay || 500);
  };
}

$( document ).ready( function(  ){
	
	$("#poem-subject").keydown(throttle(function() {
		var padding = 40;
		if ($(this).val().length === 0) {
			//ummm probably fix this at some point
			$(this).css("width", "613px");
		}
		else {
			var valWidth = ($(this).textWidth() + padding) + 'px';
			$(this).css("width", valWidth);
		}
	}, 1));

	$('#poem-subject').autocomplete({
		minLength: 1,
		delay: 100,
		source: function(request, response) {
			$.ajax({
				url: "/search",
				type: 'GET',
				data: {
					q: $('#poem-subject').val()
				},
				success: function(results) {
					response(results)
				}
			});
		},
		select: function( event, ui ) {
			// Grab subject from input field
			resetPoem();
			var poemSubject = $( '#poem-subject' ).val(  );
			$('#poem-subject').blur();

			// Set poem variable
			var poem = '';
			currentPoem = null;

			// Throbber
			$( '#poem-lines' ).html( '<div class="loading">'+ 'Fetching poem' + '</div>' );

			$.post("/poems", {'poemTitle': poemSubject}, function(data) {
				renderPoem(data);
				renderPoemImage(data.starting_page);
				renderTooltips(data);
				currentPoem = data;
				if (!data.complete) {
					setTimeout(getPoem, 1000);
				}
			});
		}
	});

	$('.index-poem__lines').on('mouseenter', '.index-poem__line-content', function() {
		var index = $(this).parent().index("p") + 1;
		$(".index-poem__tooltip").css("display", "none");
		$(".index-poem__tooltip:nth-of-type("+index+")").css("display", "inline-block");
	});

	$(".index-poem__image").load(function() {
		var width = $(this).width();
		$(this).css("margin-left", "-" + Math.floor(width/2) + "px")
	});

} );

function getPoem() {
	$.post('/poems/' + currentPoem.id, {poem: currentPoem}, function(data) {
		renderPoem(data);
		renderTooltips(data);
		currentPoem = data;
		if (!data.complete) {
			setTimeout(getPoem, 1000);
		}
	});
}

//data.starting_page
function renderPoemImage(pageId) {
	$.get('/pages/' + pageId, function(data) {
		$(".index-poem__image").attr("src", data.imageUrl);
		$(".index-poem__image").css("display", "block");
	});
}

function renderPoem(poemJson) {
	var poem = poemJson.lines;

	if (poem) {
		$( '#poem-lines' ).html( templates.poem({poem: poem}) );
	}
}

function renderTooltips(poemJson) {
	var poem = poemJson.lines;
	if (poem) {
		$( '#poem-tooltips' ).html( templates.tooltips({poem: poem}) );
	}
}

function resetPoem() {
	$( '#poem-lines' ).html("");
	$( '#poem-tooltips' ).html("");
	$(".index-poem__image").css("display", "none");
}
