'use strict';

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
			url: 'http://localhost/api/v2/pages/' + poemSubject + '/poems',
			method: 'POST',
			xhrFields: {
				withCredentials: true
			},
			success: function( data ){
				if (data.complete) {
					renderPoem(data);
				}
				else {
					setTimeout(getPoem.bind(null, data.id), 1000);
				}
			}
		});

	} );
} );

function getPoem(poemId) {
	$.ajax({
		url: 'http://localhost/api/v2/poems/' + poemId, 
		method: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if (data.complete) {
				renderPoem(data);
			}
			else {
				setTimeout(getPoem.bind(null, data.id), 1000);
			}
		}
	});
}

function renderPoem(poemJson) {
	var poem = poemJson.lines;
	var poemHtml = '';

	// Pick the first line from each set of possible lines
	$.each( poem, function( index, value ) {
		poemHtml = poemHtml.concat( '<li>' + value.text + '</li>' );
	} );

	// Add poem to the page
	$( '.poem' ).html( poemHtml );
}
