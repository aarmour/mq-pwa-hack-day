const commonJs = require('rollup-plugin-commonjs');
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const nodeResolve = require('rollup-plugin-node-resolve');
const rimraf = require('rimraf');
const rollup = require('rollup');
const runSequence = require('run-sequence');
const swPrecache = require('sw-precache');
const closure = require('google-closure-compiler-js');
const connect = require('gulp-connect');
const packageJson = require('./package.json');

class RollupRx {
  resolveId(id, from){
    if(id.startsWith('rxjs/')){
      return `${__dirname}/node_modules/rxjs-es/${id.split('rxjs/').pop()}.js`;
    }
  }
}

function closureCompilerPlugin(options: any = {}){
  return {
    transformBundle(bundle){
      const compilation = Object.assign({}, options, {
        jsCode: options.jsCode ? options.jsCode.concat({ src: bundle }) : [{ src: bundle }]
      });
	  console.log('- Closure compiler is optimizing. It can take a minute or two...');
      const transformed = closure.compile(compilation);
	  return { code: transformed.compiledCode, map: transformed.sourceMap };
    }
  }
}

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
  const config = {
    cacheId: packageJson.name,
    /*
    dynamicUrlToDependencies: {
      'dynamic/page1': [
        path.join(rootDir, 'views', 'layout.jade'),
        path.join(rootDir, 'views', 'page1.jade')
      ],
      'dynamic/page2': [
        path.join(rootDir, 'views', 'layout.jade'),
        path.join(rootDir, 'views', 'page2.jade')
      ]
    },
    */
    // If handleFetch is false (i.e. because this is called from generate-service-worker-dev), then
    // the service worker will precache resources but won't actually serve them.
    // This allows you to test precaching behavior without worry about the cache preventing your
    // local changes from being picked up during the development cycle.
    handleFetch: handleFetch,
    // logger: $.util.log,
    runtimeCaching: [
      {
        urlPattern: /api\.mapbox\.com\/styles\/v1\/mapquest\//,
        handler: 'networkFirst',
        // See https://github.com/GoogleChrome/sw-toolbox#options
        options: {
          cache: {
            name: 'style-cache'
          }
        }
      },
      {
        urlPattern: /api\.mapbox\.com\/fonts\/v1\/mapquest\//,
        handler: 'networkFirst',
        // See https://github.com/GoogleChrome/sw-toolbox#options
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
      `${rootDir}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff2,manifest}`
    ],
    stripPrefix: rootDir + '/',
    // verbose defaults to false, but for the purposes of this demo, log more.
    verbose: true
  };

  swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
}

import { gulpGenerateManifest, gulpAddStaticFiles } from '@angular/service-worker/build';

gulp.task('build', done => runSequence(
  'task:clean',
  'task:ngc',
  'task:rollup',
  'task:shell',
  [
    'task:static',
    'task:assets',
  ],
  'task:service-worker',
  'task:worker-script',
  done
));

gulp.task('build-noshell', done => runSequence(
  'task:clean',
  'task:ngc',
  'task:rollup',
  'task:no-shell',
  [
    'task:static',
    'task:assets',
  ],
  'task:service-worker',
  'task:worker-script',
  done
));

gulp.task('task:clean', done => {
  console.log('- Cleaning tmp and dist folders...');
  rimraf('tmp', () => rimraf('dist', () => done()));
});

gulp.task('task:ngc', () => {
  console.log('- Compiling Angular app using settings from tsconfig-esm.json...');
  childProcess.execSync('./node_modules/.bin/ngc -p tsconfig-esm.json');
});

gulp.task('task:rollup', done => {
  console.log('- Rolling up using main-static.js as an entry...');
  rollup
    .rollup({
      entry: 'tmp/ngc/main-static.js',
      plugins: [
        new RollupRx(),
        nodeResolve({jsnext: true, main: true}),
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
    .then(bundle => bundle.write({
      format: 'iife',
      dest: 'tmp/rollup/app.js',
    }))
    .then(() => done(), err => console.error('output error', err));
});

gulp.task('task:worker-script', () => gulp
  .src([
    'node_modules/@angular/service-worker/bundles/worker-basic.js',
  ])
  .pipe(gulp.dest('dist'))
);

gulp.task('task:shell', () => {
  console.log('- Rendering app shell using main-universal-entry.js as an entry...');
  childProcess.execSync('node ./main-universal-entry.js');
});

gulp.task('task:static', () => gulp
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
  .pipe(gulp.dest('dist'))
);

gulp.task('task:no-shell', () => gulp
  .src([
    'index.html',
  ])
  .pipe(gulp.dest('dist'))
);

gulp.task('task:assets', () => gulp
  .src([
    'assets/**/*.*'
  ])
  .pipe(gulp.dest('dist/assets'))
);

gulp.task('task:service-worker', (callback) => writeServiceWorkerFile('dist', true, callback));

gulp.task('connect', function() {
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
