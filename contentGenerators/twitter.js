var getTweets = function( callback ) {

	var configs = require( process.env.HOME + '/configs.json' ) || {};

	var OAuth = require('OAuth');

	var oauth = new OAuth.OAuth(
		'https://api.twitter.com/oauth/request_token',
		'https://api.twitter.com/oauth/access_token',
		configs.twitter.oauth.uzetest.APPLICATION_KEY, //'your application consumer key',
		configs.twitter.oauth.uzetest.APPLICATION_SECRET, // 'your application secret',
		'1.0A',
		null,
		'HMAC-SHA1'
	);
	oauth.get(
		'https://api.twitter.com/1.1/favorites/list.json?screen_name=theHuzz',
		configs.twitter.oauth.uzetest.USER_KEY, //'your user toke for this app', //test user token
		configs.twitter.oauth.uzetest.USER_SECRET, // 'your user secret for this app', //test user secret            
		function (e, data, res){
			if (e) console.error(e);
			callback( data );
		});
};

module.exports = getTweets;