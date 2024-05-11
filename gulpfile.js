import gulp from 'gulp';
import less from 'gulp-less';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import pug from 'gulp-pug';
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
// var cleanCSS = require('gulp-clean-css');
import { deleteAsync } from 'del';

var paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  views: {
    src: 'src/views/*.pug',
    watch: 'src/views/**/*.pug',
    dest: 'dist/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
export function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return deleteAsync([ 'dist' ]);
}

/*
 * Define our tasks using plain functions
 */
export function styles() {
  return gulp.src(paths.styles.src)
    .pipe(less())
    // pass in options to the stream
    // .pipe(rename({
    //   basename: 'main',
    //   suffix: '.min'
    // }))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    // .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

export function views() {
  return gulp.src(paths.views.src)
    .pipe(
      pug({})
    )
    .pipe(gulp.dest(paths.views.dest));
}

export function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.views.watch, views);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
const build = gulp.series(clean, gulp.parallel(styles, scripts, views));

export default build;