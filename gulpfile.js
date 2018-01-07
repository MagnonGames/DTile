const gulp = require("gulp");
const replace = require("gulp-replace");
const mergeStream = require("merge-stream");
const gulpBabel = require("gulp-babel");
const symlink = require("gulp-sym");
const htmlMinify = require("gulp-htmlmin");
const babelMinify = require("gulp-babel-minify");
const gulpif = require("gulp-if");
const del = require("del");
const rollup = require("rollup");
const PolymerProject = require("polymer-build").PolymerProject;
const HtmlSplitter = require("polymer-build").HtmlSplitter;

const htmlMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
};

gulp.task("code", ["pre-build"], () => {
    process.chdir("./build-temp");

    const project = new PolymerProject({
        entrypoint: "index.html"
    });
    const sourcesHtmlSplitter = new HtmlSplitter();

    return mergeStream(project.sources(), project.dependencies())
        .pipe(replace("process.env.NODE_ENV", `"production"`))
        .pipe(replace("__VERSION__", getVersion()))
        .pipe(sourcesHtmlSplitter.split())
        .pipe(gulpif(/\.html$/, htmlMinify(htmlMinifyOptions)))
        .pipe(gulpif(/\.js$/, babelMinify(null, { comments: false })))
        .pipe(sourcesHtmlSplitter.rejoin())
        .pipe(project.bundler())
        .pipe(gulp.dest("../build/"));
});

gulp.task("pre-build", ["clean"], () => {
    return mergeStream(
        gulp.src("./src/**/*.html")
            .pipe(replace(/<script type="module" src="(.+?)">/g, function(_, src) {
                // Compile all <script type="module"> and put them in a "built"
                // directory.

                const name = Math.floor(Math.random() * 10000) + "";
                const path = this.file.path.match(/(^.*\/)/)[1];
                const foldersDeep = this.file.path.match(/(\/)/g).length -
                    this.file.cwd.match(/(\/)/g).length - 1;

                rollup.rollup({
                    input: `${path}${src}`
                }).then(bundle => bundle.write({
                    file: `./build-temp/built/${name}.js`,
                    format: "iife",
                    name: `b${name}`,
                    exports: "named"
                }));

                return `<script src="${"../".repeat(foldersDeep)}built/${name}.js">`;
            }))
            .pipe(transpileWithinHtml())
            .pipe(gulp.dest("./build-temp/src/")),
        gulp.src(["./src/**/*.js", "!./src/renderer/**/*"])
            .pipe(gulpBabel())
            .pipe(gulp.dest("./build-temp/src/")),
        gulp.src(["./node_modules", "./bower_components"])
            .pipe(symlink(["./build-temp/node_modules", "./build-temp/bower_components"])),
        gulp.src("./index.html")
            .pipe(gulp.dest("./build-temp/"))
    );
});

gulp.task("image", ["clean"], () => {
    return gulp.src("./img/**/*")
        .pipe(gulp.dest("./build/img/"));
});

gulp.task("meta", ["clean"], () => {
    return gulp.src("./manifest.json")
        .pipe(gulp.dest("./build/"));
});

gulp.task("clean", () => {
    return del([
        "build", "build-temp"
    ]);
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

gulp.task("default", ["code", "image", "meta"]);

// ***
// Hacky HTML-babel transpiler because polymer-build is pretty shitty
// (If you haven't noticed, I'm pretty pissed as of writing this)
// ***

const through = require("through2");
const babelCore = require("babel-core");

function transpileWithinHtml(opts) {
    opts = opts || {};

    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        try {
            const fileOpts = Object.assign({}, opts, {
                filename: file.path,
                filenameRelative: file.relative,
                sourceMap: Boolean(file.sourceMap),
                sourceFileName: file.relative,
                sourceMapTarget: file.relative
            });

            const html = file.contents.toString().replace(
                /([\S\s]*?<script>)([\S\s]+?)(<\/script>[\S\s])/g,
                (match, before, js, after) => {
                    const { code } = babelCore.transform(js, fileOpts);
                    return `${before}${code}${after}`;
                }
            );

            file.contents = new Buffer(html);

            this.push(file);
        } catch (err) {
            console.error(`[**] ${err}`);
            this.emit("error");
        }

        cb();
    });
};
