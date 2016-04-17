var gulp = require("gulp"),
	gutil = require("gulp-util"),
	notify = require("gulp-notify"),
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

function handleError(error) {
	notify.onError({
		title: "Build Error!",
		message: "<%= error.message %>"
	})(error);

	this.emit("end");
}

function buildJS(watch) {
	var browserifyInstance = browserify({
			entries: ["./src/js/main.js"],
			debug: true,
			cache: {},
		    packageCache: {},
		    fullPaths: watch
		}).transform("babelify", {
			presets: ["es2015", "react"]
		});

	var b = watch ? watchify(browserifyInstance) : browserifyInstance;

 	var build = function() {
		 // TODO: MINIFIED BUILD
		return b.bundle()
			.on("error", handleError)
			.pipe(source("dTile.js"))
			.pipe(buffer())
			.pipe(sourcemaps.init({ loadMaps: true }))
			.pipe(sourcemaps.write("."))
			.pipe(gulp.dest("bin/js"));
	}

	if (watch) {
		b.on("update", function() {
			gutil.log("Rebundling...");
			build();
		});
		b.on("log", function(e) {
			gutil.log("Bundling Successful: " + gutil.colors.gray(e));
		});
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

gulp.task("icons", function() {
	gulp.src("./src/icon/**/*")
		.pipe(gulp.dest("bin/icons"));
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

gulp.task("default", ["js", "css", "html", "images", "icons"]);

// TODO: Proper build task
// TODO: Uglify everything in final build, not in dev.
