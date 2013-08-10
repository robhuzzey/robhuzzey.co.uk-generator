var HelperUtils = require("punch").Utils.Helper;
module.exports = {
	"setup" : function( config ) {

	},

	get: function( basepath, file_extension, options, callback ){
		var error = null;
		var tag_helpers = {};
		var block_helpers = {
			"isActivePage" : function() {
				return HelperUtils.checkArgs( arguments, function( text ) {
					return ( text.substring( 0, basepath.length ) === basepath ) ? 'active' : '';
				});
			}
		};
		var response_options = {};
		var last_modified = new Date();

		return callback( error, { "tag": tag_helpers, "block": block_helpers }, response_options, last_modified );
	}
}