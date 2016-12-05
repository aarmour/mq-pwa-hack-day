"use strict";
var commonJs = require('rollup-plugin-commonjs');
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var nodeResolve = require('rollup-plugin-node-resolve');
var rimraf = require('rimraf');
var rollup = require('rollup');
var runSequence = require('run-sequence');
var swPrecache = require('sw-precache');
var closure = require('google-closure-compiler-js');
var connect = require('gulp-connect');
var packageJson = require('./package.json');
var RollupRx = (function () {
    function RollupRx() {
    }
    RollupRx.prototype.resolveId = function (id, from) {
        if (id.startsWith('rxjs/')) {
            return __dirname + "/node_modules/rxjs-es/" + id.split('rxjs/').pop() + ".js";
        }
    };
    return RollupRx;
}());
function closureCompilerPlugin(options) {
    if (options === void 0) { options = {}; }
    return {
        transformBundle: function (bundle) {
            var compilation = Object.assign({}, options, {
                jsCode: options.jsCode ? options.jsCode.concat({ src: bundle }) : [{ src: bundle }]
            });
            console.log('- Closure compiler is optimizing. It can take a minute or two...');
            var transformed = closure.compile(compilation);
            return { code: transformed.compiledCode, map: transformed.sourceMap };
        }
    };
}
function writeServiceWorkerFile(rootDir, handleFetch, callback) {
    var config = {
        cacheId: packageJson.name,
        handleFetch: handleFetch,
        runtimeCaching: [
            {
                urlPattern: /api\.mapbox\.com\/styles\/v1\/mapquest\//,
                handler: 'networkFirst',
                options: {
                    cache: {
                        name: 'style-cache'
                    }
                }
            },
            {
                urlPattern: /tiles\.mapbox\.com/,
                handler: 'networkFirst',
                options: {
                    cache: {
                        name: 'tile-cache'
                    }
                }
            },
            {
                urlPattern: /api\.mapbox\.com\/v4\/mapbox\.mapbox-terrain-v2/,
                handler: 'networkFirst',
                options: {
                    cache: {
                        name: 'tile-cache'
                    }
                }
            }
        ],
        staticFileGlobs: [
            rootDir + "/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff2,manifest}"
        ],
        stripPrefix: rootDir + '/',
        verbose: true
    };
    swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
}
gulp.task('build', function (done) { return runSequence('task:clean', 'task:ngc', 'task:rollup', 'task:shell', [
    'task:static',
    'task:assets',
], 'task:service-worker', 'task:worker-script', done); });
gulp.task('build-noshell', function (done) { return runSequence('task:clean', 'task:ngc', 'task:rollup', 'task:no-shell', [
    'task:static',
    'task:assets',
], 'task:service-worker', 'task:worker-script', done); });
gulp.task('task:clean', function (done) {
    console.log('- Cleaning tmp and dist folders...');
    rimraf('tmp', function () { return rimraf('dist', function () { return done(); }); });
});
gulp.task('task:ngc', function () {
    console.log('- Compiling Angular app using settings from tsconfig-esm.json...');
    childProcess.execSync('./node_modules/.bin/ngc -p tsconfig-esm.json');
});
gulp.task('task:rollup', function (done) {
    console.log('- Rolling up using main-static.js as an entry...');
    rollup
        .rollup({
        entry: 'tmp/ngc/main-static.js',
        plugins: [
            new RollupRx(),
            nodeResolve({ jsnext: true, main: true }),
            commonJs({
                include: 'node_modules/**',
                exclude: ['node_modules/rxjs/**'],
                namedExports: {
                    'node_modules/angular2-universal/browser.js': ['UniversalModule', 'prebootComplete', 'platformUniversalDynamic'],
                }
            }),
            closureCompilerPlugin({ compilationLevel: 'SIMPLE' }),
        ],
    })
        .then(function (bundle) { return bundle.write({
        format: 'iife',
        dest: 'tmp/rollup/app.js',
    }); })
        .then(function () { return done(); }, function (err) { return console.error('output error', err); });
});
gulp.task('task:worker-script', function () { return gulp
    .src([
    'node_modules/@angular/service-worker/bundles/worker-basic.js',
])
    .pipe(gulp.dest('dist')); });
gulp.task('task:shell', function () {
    console.log('- Rendering app shell using main-universal-entry.js as an entry...');
    childProcess.execSync('node ./main-universal-entry.js');
});
gulp.task('task:static', function () { return gulp
    .src([
    'manifest.webmanifest',
    'MaterialIcons-Regular.woff2',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/@angular/material/core/theming/prebuilt/indigo-pink.css',
    'node_modules/mapbox-gl/dist/mapbox-gl.js',
    'node_modules/mapbox-gl/dist/mapbox-gl.css',
    'tmp/rollup/app.js',
    'tmp/app-shell/index.html',
    'push-sw.js'
])
    .pipe(gulp.dest('dist')); });
gulp.task('task:no-shell', function () { return gulp
    .src([
    'index.html',
])
    .pipe(gulp.dest('dist')); });
gulp.task('task:assets', function () { return gulp
    .src([
    'assets/**/*.*'
])
    .pipe(gulp.dest('dist/assets')); });
gulp.task('task:service-worker', function (callback) { return writeServiceWorkerFile('dist', true, callback); });
gulp.task('connect', function () {
    connect.server({
        root: 'dist',
        livereload: false,
        port: 4321
    });
});
gulp.task('html', function () {
    gulp.src('./dist/*.*')
        .pipe(connect.reload());
});
gulp.task('watch', function () {
    gulp.watch(['./dist/*.*'], ['html']);
});
gulp.task('serve', ['connect', 'watch']);
