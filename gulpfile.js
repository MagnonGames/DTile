const gulp = require("gulp");
const vulcanize = require("gulp-vulcanize");
const crisper = require("gulp-crisper");

gulp.task("build", function() {
	return gulp.src("index.html")
		.pipe(vulcanize({
			stripComments: true,
			inlineScripts: true,
			inlineCss: true
		}))
		.pipe(crisper())
		.pipe(gulp.dest("build/"));
});

gulp.task("default", ["build"]);
