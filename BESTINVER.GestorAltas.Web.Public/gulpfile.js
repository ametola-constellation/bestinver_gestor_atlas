"use strict";

const gulp = require("gulp");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cssmin = require("gulp-cssmin");
const terser = require("gulp-terser");
const merge = require("merge-stream");
const del = require("del");
const sass = require("gulp-sass")(require('sass'));
const bundleconfig = require("./bundleconfig.json");
const compileconfig = require("./compilerconfig");

const regex = {
    sass: /\.scss$/,
    css: /\.css$/,
    js: /\.js$/
};

function createErrorHandler(name) {
    return function (err) {
        console.error(`Error from ${name} in compress task`, err.toString());
    };
}

function clean() {
    return del(['*/lib/**/*.js', '*/lib/**/*.css', '*/js/**/*min.js', '*/css/**/*.css']);
}

function createBundles() {
    const bundles = getBundles(regex.js); 
    const tasks = bundles.map(bundle => {
        const filteredInputFiles = bundle.inputFiles.filter(file => !file.includes('bundles'));    
        if (filteredInputFiles.length === 0) {
            return;
        }
        return gulp
            .src(filteredInputFiles, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });
    return merge(...tasks.filter(task => task !== undefined));
}


function minifyBundles() {
    const bundles = getBundles(regex.js);
    const tasks = bundles.map(bundle => {
        return gulp
            .src(bundle.inputFiles, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(terser())
            .on("error", createErrorHandler("terser"))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });
    return merge(tasks);
}

function minifyCSS() {
    const bundles = getBundles(regex.css);

    const copyStyles = bundles.map(bundle => {
        return gulp
            .src(bundle.inputFiles, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(bundle.outputFileName))
            .pipe(gulp.dest("."))
            .on("error", createErrorHandler("gulp.dest"));
    });

    const minifyStyles = bundles.map(bundle => {
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
    const tasks = getCompile(regex.sass).map(compile => {
        return gulp
            .src(compile.inputFile, { base: "." })
            .on("error", createErrorHandler("gulp.src"))
            .pipe(concat(compile.outputFile))
            .pipe(sass().on("error", sass.logError))
            .on("error", createErrorHandler("sass"))
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
    return compileconfig.filter(compile => regexPattern.test(compile.inputFile));
}

function getBundles(regexPattern) {
    return bundleconfig.filter(bundle => regexPattern.test(bundle.outputFileName));
}

gulp.task("clean", clean);
gulp.task("sass", compileSass);
gulp.task("min:js1", createBundles);
gulp.task("min:js2", minifyBundles);
gulp.task("min:css", minifyCSS);
gulp.task("default", gulp.series("clean", "sass", gulp.parallel("min:css", gulp.series("min:js1", "min:js2"))));
gulp.task("watch", watchFiles);