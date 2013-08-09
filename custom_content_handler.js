var default_content_handler = require("punch").ContentHandler;
var restify = require( 'restify' );

// This is a lazy KLUDGE to get custom content from an API, it will do for now ;)
var apiContent = function( api_path, content_identifier, callback ) {

	var client = restify.createJsonClient({
		url: 'http://robhuzzey.herokuapp.com'
	});

	client.get( api_path, function(err, req, res, obj) {

		var self = this;
		var error = null;
		var content = {};
		var response_options = {};
		var last_modified = new Date();

		// Namespace the content from the api by it's identifier
		content[content_identifier] = obj; 

		// Get shared content & merge into content from api call
		default_content_handler.getContent( 'shared', function( error, shared_content, last_modified ) {
			
			if( shared_content !== null ) {
				for( var i in shared_content ) {
					content[i] = shared_content[i];
				}
			}

			// get the content specified in the contents folder
			default_content_handler.getContent( content_identifier, function( error, other_content, last_modified ) {

				if( other_content !== null ) {
					for( var i in other_content ) {
						content[i] = other_content[i];
					}
				}

				return callback(error, content, response_options, last_modified);
			});

			
		});

	});
};


module.exports = {
	setup: function(config) {
		// read the config.json
		// and extract necessary properties
		default_content_handler.setup(config);
	},

	isSection: function(request_path) {
		// return if the given path is a section
		default_content_handler.isSection(request_path);
	},

	getSections: function(callback) {
		// return all sections available under contents
		default_content_handler.getSections(callback);
	},

	negotiateContent: function(request_path, content_type, options, callback) {

		// TODO: Find a better way to handle these routes... right now, you're just being lazy! ;)

		if( request_path === '/books' ) {
			apiContent( '/google/bookshaveread', 'books', callback );
		} else if( request_path === '/links' ) {
			apiContent( '/delicious/links', 'links', callback );
		} else {
			default_content_handler.negotiateContent(request_path,content_type,options,callback);
		}
	},

	getContentPaths: function(request_path, callback) {
		// invoke the callback with all content paths stems from the given request_path
		default_content_handler.getContentPaths(request_path,callback);
	}

}