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

	// Copy over the Images
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
				'dist/assets/css/production.min.css' : ['src/assets/stylesheets/*']
			}
		}
	},

	// Minify the JS
	uglify: {
		my_target: {
			files: {
				'dist/assets/javascript/production.min.js' : [ 'src/assets/javascript/*' ]
			}
		}
	},

	// This is our grunt server
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

	// Look for file changes & live reload
	watch: {
		options: {
			livereload: true
		},
		js: {
			files: [ 'src/**/*' ],
			tasks: [ 'generate' ]
		}
	},

	// Simple git deployment
	git_deploy: {
		your_target: {
			options: {
				url: 'git@github.com:robhuzzey/robhuzzey.github.io.git',
				message : '<%= grunt.option( "msg" ) || grunt.warn( "No commit message specified. use --msg=**your message**" ) %>'
			},
			src: 'dist/'
		},
	}

});

// Clear out the distribution directory ready to re-generate site
grunt.loadNpmTasks( 'grunt-contrib-clean' );

grunt.loadNpmTasks( 'assemble' );

// Get the 3rd party data for the site
grunt.loadNpmTasks( 'grunt-fetch-pages' );

// Move static assets
grunt.loadNpmTasks( 'grunt-contrib-copy' );

// Mush up the code
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

// The server & watcher stuff
grunt.loadNpmTasks( 'grunt-contrib-watch' );
grunt.loadNpmTasks( 'grunt-contrib-connect' );

// Push to git hubs
grunt.loadNpmTasks( 'grunt-git-deploy' );

// Generate the site from scratch
grunt.registerTask( 'generatewithfiles', [ 'clean', 'fetchpages', 'copy', 'generate' ] );

// Standard generate... used in watch task
grunt.registerTask( 'generate', [ 'assemble', 'cssmin', 'uglify' ] );

// Push the code out
grunt.registerTask( 'deploy', [ 'generatewithfiles', 'git_deploy' ] );

// Standard ;)
grunt.registerTask( 'default', [ 'generatewithfiles', 'connect', 'watch' ] );