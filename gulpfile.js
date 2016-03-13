var gulp = require("gulp"),
	gutil = require("gulp-util"),
	babelify = require("babelify"),
	sourcemaps = require("gulp-sourcemaps"),
	browserify = require("browserify"),
	watchify = require("watchify"),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	sass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	imagemin = require("gulp-imagemin");

gulp.task("js", function() { return buildJS(); });

function buildJS(watch) {
	var browserifyInstance = browserify({
			entries: ["./src/js/main.js"],
			debug: true
		}).transform("babelify", {
			presets: ["es2015"]
		});

	var b = watch ? watchify(browserifyInstance) : browserifyInstance;

 	var build = function() {
		 // TODO: HANDLE ERRORS, MINIFIED BUILD
		return b.bundle()
			.pipe(source("dTile.js"))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("bin/js"));
	}

	if (watch) {
		b.on("update", build);
	}

	return build();
}

gulp.task("css", function() {
	gulp.src("./src/css/**/*.scss")
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("bin/css"));
});

gulp.task("html", function() {
	gulp.src("./src/html/**/*.html")
		.pipe(gulp.dest("bin"));
});

gulp.task("images", function() {
	gulp.src("./src/images/**/*")
		.pipe(imagemin({
			svgoPlugins: [{removeViewBox: true}],
			multipass: true,
		}))
		.pipe(gulp.dest("bin/images"));
});

gulp.task("watch", ["default"], function() {
	buildJS(true);
	gulp.watch("./src/css/**/*.scss", ["css"]);
	gulp.watch("./src/html/**/*.html", ["html"]);
	gulp.watch("./src/images/**/*", ["images"]);
});

gulp.task("default", ["js", "css", "html", "images"]);

// TODO: Proper build task
// TODO: Uglify everything in final build, not in dev.
