const gulp = require("gulp");
const vulcanize = require("gulp-vulcanize");
const crisper = require("gulp-crisper");
const replace = require("gulp-replace");

gulp.task("build", function() {
	return gulp.src("index.html")
		.pipe(vulcanize({
			stripComments: true,
			inlineScripts: true,
			inlineCss: true
		}))
		.pipe(replace("__VERSION__", getVersion()))
		.pipe(crisper())
		.pipe(gulp.dest("build/"));
});

function getVersion() {
	const branch = process.env.TRAVIS_BRANCH;
	const buildNo = process.env.TRAVIS_BUILD_NUMBER;
	const commit = process.env.TRAVIS_COMMIT;

	if (branch && buildNo && commit) {
		return branch + buildNo + " (" + commit.substring(0, 7) + ")";
	} else {
		return "N/A";
	}
}

gulp.task("default", ["build"]);
