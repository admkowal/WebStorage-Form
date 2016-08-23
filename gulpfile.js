var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    plumber = require("gulp-plumber"),
    browserSync = require("browser-sync"),
    del = require("del"),
    useref = require("gulp-useref"),
    uglify = require("gulp-uglify"),
    gulpif = require("gulp-if"),
    imagemin = require("gulp-imagemin"),
    runSequence = require("run-sequence"),
    argv = require("yargs").argv,
    babel = require("gulp-babel"),
    gutil = require("gulp-util");

gulp.task("babelify", function () {

    return gulp.src("src/js/src/*.js")
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("src/js"));

});

gulp.task("css", function() {

    gutil.log( gutil.colors.yellow("Compiling SASS to CSS...") );

    return gulp.src("src/sass/main.scss")
        .pipe(plumber())
        .pipe(sass.sync({
            outputStyle: "expanded"
        }))
        .pipe(autoprefixer({
            browsers: ["last 5 version", "IE 9"]
        }))
        .pipe(gulp.dest("src/css/"))
        .pipe(browserSync.stream());

});

gulp.task("server", function() {

    browserSync.init({
        server: "src/"
    });

});

gulp.task("watch", function() {

    gulp.watch("src/sass/**/*.scss", ["css"]);
    gulp.watch(["src/js/src/*.js"], ['babelify']);
    gulp.watch(["src/*.html", "src/js/*.js"], browserSync.reload);

});

gulp.task("clean", function() {

    return del("dist/");

});

gulp.task("html", function() {

    gulp.src("src/*.html")
        .pipe(useref())
        .pipe( gulpif("*.js", uglify() ) )
        .pipe(gulp.dest("dist/"));

});

gulp.task("images", function() {

    return gulp.src("dist/images/*", {
            base: "dist"
        })
        .pipe(imagemin())
        .pipe(gulp.dest("dist/"));

});

gulp.task("copy", function() {

    return gulp.src(["src/css/**/*.css", "src/images/*", "src/uploads/*", "src/fonts/*", "src/js/lib/*"], {
        base: "src"
    })
    .pipe(gulp.dest("dist/"));

});

gulp.task("build", function(cb) {

    runSequence("clean", "html", "copy", "images", cb);

});

gulp.task("build:server", ["build"], function() {

    browserSync.init({
        server: "dist/"
    });

});

gulp.task("default", ["css", "babelify", "server", "watch"]);