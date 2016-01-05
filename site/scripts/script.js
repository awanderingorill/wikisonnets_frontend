'use strict';

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
		minLength: 3,
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

			// Set poem variable
			var poem = '';

			// Throbber
			$( '.poem' ).html( '<div class="loading">'+ 'Fetching poem' + '</div>' );

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
					if (!data.complete) {
						setTimeout(getPoem.bind(null, data.id), 1000);
					}
				}
			});

		}
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
		}
	});
}

function renderPoem(poemJson) {
	var poem = poemJson.lines;
	var poemHtml = '';

	if (poem) {

		// Pick the first line from each set of possible lines
		$.each( poem, function( index, value ) {
			if (value.page_id == 0)
				poemHtml = poemHtml.concat( '<p>' + "----------------" + '</p>' );
			else
				poemHtml = poemHtml.concat( '<p>' + value.text + '</p>' );
		} );

		// Add poem to the page
		$( '#poem-lines' ).html( poemHtml );
	}
}
