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
		var padding = 30;
		if ($(this).val().length === 0) {
			$(this).css("width", "460px");
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
			var poemSubject = $( '#poem-subject' ).val(  );
			$('#poem-subject').blur();
			currentPoem = null;

			// Set poem variable
			var poem = '';

			// Throbber
			$( '#poem-lines' ).html( '<div class="loading">'+ 'Fetching poem' + '</div>' );

			// Hit the API
			//$.getJSON( 'http://wikisonnet-dev2.elasticbeanstalk.com/api/v1/compose/' + poemSubject, function( data ){
			var hostname = window.location.hostname;
			$.ajax({
				url: 'http://' + hostname + ':8000/api/v2/poems',
				method: 'POST',
				data: {'poemTitle': poemSubject},
				xhrFields: {
					withCredentials: true
				},
				success: function( data ){
					renderPoem(data);
					currentPoem = data;
					if (!data.complete) {
						setTimeout(getPoem.bind(null, data.id), 1000);
					}
					else {
						$.get("/poems/" + data.id + "?tooltips", function(completedPoem) {
							$( '#poem-tooltips' ).html( templates.tooltips({poem: completedPoem.lines}) );
						});
					}
				}
			});

		}
	});

	$('.index-poem__lines').on('mouseenter', '.index-poem__line-content', function() {
		var index = $(this).parent().index("p") + 1;
		$(".index-poem__tooltip").css("display", "none");
		$(".index-poem__tooltip:nth-of-type("+index+")").css("display", "inline-block");
	});

} );

function getPoem(poemId) {
	var hostname = window.location.hostname;
	$.ajax({
		url: 'http://' + hostname + ':8000/api/v2/poems/' + poemId,
		method: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			renderPoem(data);
			if (!data.complete) {
				setTimeout(getPoem.bind(null, data.id), 1000);
			}
			else {
				$.get("/poems/" + data.id + "?tooltips", function(completedPoem) {
					$( '#poem-tooltips' ).html( templates.tooltips({poem: completedPoem.lines}) );
				});
			}
		}
	});
}

function renderPoem(poemJson) {
	var poem = poemJson.lines;

	if (poem) {
		$( '#poem-lines' ).html( templates.poem({poem: poem}) );
	}
}
