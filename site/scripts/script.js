'use strict';

require('jquery');
require('jquery-ui');

$( document ).ready( function(  ){

	$( '#get-poem' ).click( function(  ){

		// Grab subject from input field
		var poemSubject = $( '#poem-subject' ).val(  );

		// Set poem variable
		var poem = '';

		// Throbber
		$( '.poem' ).html( '<div class="loading">'+ 'Fetching poem' + '</div>' );

		// Hit the API
		//$.getJSON( 'http://wikisonnet-dev2.elasticbeanstalk.com/api/v1/compose/' + poemSubject, function( data ){
		$.ajax({
			url: 'http://localhost/api/v2/poems',
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

	} );

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
		}
	});

} );

function getPoem(poemId) {
	$.ajax({
		url: 'http://localhost/api/v2/poems/' + poemId,
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
				poemHtml = poemHtml.concat( '<li>' + "----------------" + '</li>' );
			else
				poemHtml = poemHtml.concat( '<li>' + value.text + '</li>' );
		} );

		// Add poem to the page
		$( '.poem' ).html( poemHtml );
	}
}
