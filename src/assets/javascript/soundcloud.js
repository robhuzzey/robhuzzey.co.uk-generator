// If we have the soundcloud library, do the soundcloud stuff!
if( window.SC ) {
	SC.initialize({
		client_id: '7814cc00fc36014d569c44b2134682f3'
	});

	var trackPlayer = function( trackUrl, context ) {
		SC.oEmbed( trackUrl, { auto_play: true, iframe: true }, function(oEmbed) {
			var $player = context.querySelector( ".player" );
			$player.innerHTML = oEmbed.html;
		});
	};

	// Set the background for each track to it's waveform
	$tracks = document.querySelectorAll( '.trackContainer' );
	for( var i = 0, len = $tracks.length; i < len; i++ ) {
		(function( trackContainer ) {
			var track = trackContainer.querySelector( '.track' );
			track.style.background = "url(" + track.getAttribute( "data-waveform" ) +")";
			var button = track.querySelectorAll( "button" );
			button[0].addEventListener( "click", function() {
				trackPlayer( track.getAttribute( "data-uri" ), trackContainer );
			});
		})( $tracks[i] );
	}
}