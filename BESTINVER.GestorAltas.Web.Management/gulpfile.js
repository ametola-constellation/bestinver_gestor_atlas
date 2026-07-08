"use strict";

const gulp = require("gulp"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    terser = require("gulp-terser"),
    merge = require("merge-stream"),
    del = require("del"),
    sass = require("gulp-sass")(require('sass')),
    bundleconfig = require("./bundleconfig.json"),
    compileconfig = require("./compilerconfig");

const regex = {
    sass: /\.scss$/,
    css: /\.css$/,
    js: /\.js$/
};

function createErrorHandler(name) {
    return function (err) {
        console.error("Error from " + name + " in compress task", err.toString());
    };
}

function clean() {
    return del([
        '*/lib/**/*.js',  
        '*/lib/**/*.css', 
        '*/js/**/*min.js',
        '*/css/**/*.css',
        '!wwwroot/css/fontawesome.css'
    ]); }

function minifyJS() {
    const bundels = getBundles(regex.js);

    const copyScripts = bundels.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: "."})
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });

    const minifyScripts = bundels.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: "."})
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(terser())
            .on("error", createErrorHandler("terser"))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });

    return merge(copyScripts, minifyScripts);
}

function minifyCSS() {
    const bundels = getBundles(regex.css);

    const copyStyles = bundels.map(bundle => {
        return gulp.src(bundle.inputFiles, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });

    const minifyStyles = bundels.map(bundle => {
        return gulp
            .src(bundle.inputFiles, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(cssmin({
                showLog: true
            }))
            .on("error", createErrorHandler("cssmin"))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });

    return merge(copyStyles, minifyStyles);
}

function compileSass() {
    const tasks = getCompile(regex.sass).map(function (compile) {
        return gulp
            .src(compile.inputFile, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(sass().on("error", sass.logError))
            .pipe(concat(compile.outputFile))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });
    return merge(tasks);
}

function watchFiles() {
    getBundles(regex.js).forEach(bundle => {
        gulp.watch(bundle.inputFiles, minifyJS);
    });

    getBundles(regex.css).forEach(bundle => {
        gulp.watch(bundle.inputFiles, minifyCSS);
    });

    getCompile(regex.sass).forEach(compile => {
        gulp.watch(compile.inputFile, compileSass);
    });
}

function getCompile(regexPattern) {
    return compileconfig.filter(function (compile) {
        return regexPattern.test(compile.inputFile);
    });
}

function getBundles(regexPattern) {
    return bundleconfig.filter(function (bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

gulp.task("clean", clean);
gulp.task("sass", compileSass);
gulp.task("min:js", minifyJS);
gulp.task("min:css", minifyCSS);
gulp.task("default", gulp.series("clean", "sass", gulp.parallel("min:js", "min:css")));
gulp.task("watch", watchFiles);