var default_content_handler = require("punch").ContentHandler;
var restify = require( 'restify' );
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

			var client = restify.createJsonClient({
				url: 'http://robhuzzey.herokuapp.com'
			});

			client.get('/google/bookshaveread', function(err, req, res, obj) {

				// invoke the callback with the content for the given request_path and content type
				var self = this;
				var error = null;
				var content = obj;
				var response_options = {};
				var last_modified = new Date();

				// return callback(error, content, response_options, last_modified);

				// Get shared content & merge into content from api call
				default_content_handler.getContent( 'shared', function( error, shared_content, last_modified ) {
					
					if( shared_content !== 'null' ) {
						for( var i in shared_content ) {
							content[i] = shared_content[i];
						}
					}

					return callback(error, content, response_options, last_modified);
				});

			});
			
		} else if( request_path === '/links' ) {

			var client = restify.createJsonClient({
				url: 'http://robhuzzey.herokuapp.com'
			});

			client.get('/delicious/links', function(err, req, res, obj) {

				// invoke the callback with the content for the given request_path and content type
				var self = this;
				var error = null;
				var content = { "links" : obj };
				var response_options = {};
				var last_modified = new Date();

				// return callback(error, content, response_options, last_modified);

				// Get shared content & merge into content from api call
				default_content_handler.getContent( 'shared', function( error, shared_content, last_modified ) {
					
					if( shared_content !== 'null' ) {
						for( var i in shared_content ) {
							content[i] = shared_content[i];
						}
					}

					return callback(error, content, response_options, last_modified);
				});

			});

		} else {
			default_content_handler.negotiateContent(request_path,content_type,options,callback);
		}
	},

	getContentPaths: function(request_path, callback) {
		// invoke the callback with all content paths stems from the given request_path
		default_content_handler.getContentPaths(request_path,callback);
	}

}