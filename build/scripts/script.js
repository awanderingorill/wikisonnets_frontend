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
		$.getJSON( 'http://wikisonnet-dev2.elasticbeanstalk.com/api/v1/compose/' + poemSubject, function( data ){

			// Set some variables
			var poem = data.poem;
			var poemHtml = '';

			// Pick the first line from each set of possible lines
			$.each( poem, function( key, val ) {
				poemHtml = poemHtml.concat( '<li>' + poem[key][0] + '</li>' );
			} );

			// Add poem to the page
			$( '.poem' ).html( poemHtml );
		} );

	} );
} );
