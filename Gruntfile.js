var grunt = require( "grunt" );

grunt.initConfig({

	fetchpages: {
		dist: {
			options: {
				urls: [
					// list of remote urls to fetch, local destination file name (localFile) required
					{url: 'https://api.del.icio.us/v2/json/djhuzz?red=api&count=100', localFile: 'delicious.json'},
					{url: 'https://www.googleapis.com/books/v1/users/101891936560271534706/bookshelves/4/volumes?country=GB&maxResults=40', localFile: 'googlebooks.json'}
				],
				// base url for fetching pages via GruntJS files feature
				filesBaseURL: 'http://localhost/',
				// local target folder for fetched pages
				target: 'jsondata/'
			}
		}
	},

	assemble: {
		options: {
			flatten: true,
			assets: 'dist/assets/',
			data : [ "src/data/*.json", "src/jsondata/*.json" ],
			partials: 'src/partials/*.handlebars',
			layoutdir: 'src/templates/_layouts',
			layout: 'main.handlebars',
		},
		docs: {
			src: ['src/templates/*.handlebars','src/templates/*.markdown'],
			dest: 'dist/'
		}
	},

	// Get rid of all the files in distribution directory ready to re-generate
	clean : [ 'dist/' ],

	// Move over the Images
	copy: {
		main: {
			files: [
				// includes files within path
				{ expand: true, cwd : 'src/assets/images/', src: ['**'], dest: 'dist/assets/images/', filter: 'isFile' }
			]
		}
	},

	// Minify the CSS
	cssmin: {
		combine: {
			files: {
				'dist/assets/css/production.css' : ['src/assets/stylesheets/*']
			}
		}
	},

	connect: {
		all: {
			options:{
				port: 8002,
				hostname: '0.0.0.0',
				base: 'dist',
				livereload: true
			}
		}
	},

	watch: {
		options: {
			livereload: true
		},
		js: {
			files: [ 'src/**/*' ],
			tasks: [ 'generate' ]
		}
	}

});

grunt.loadNpmTasks( 'grunt-contrib-clean' );

grunt.loadNpmTasks( 'assemble' );
grunt.loadNpmTasks( 'grunt-fetch-pages' );

grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

grunt.loadNpmTasks( 'grunt-contrib-watch' );
grunt.loadNpmTasks( 'grunt-contrib-connect' );

// Generate the site from scratch
grunt.registerTask( 'generatewithfiles', [ 'clean', 'fetchpages', 'assemble', 'copy', 'cssmin' ] );

grunt.registerTask( 'generate', [ 'assemble', 'cssmin' ] );

grunt.registerTask( 'default', [ 'generatewithfiles', 'connect', 'watch' ] );
