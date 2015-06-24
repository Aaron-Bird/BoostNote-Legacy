var gulp = require('gulp')
var styl = require('gulp-stylus')
var autoprefixer = require('gulp-autoprefixer')
var del = require('del')
var runSequence = require('run-sequence')
var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var rename = require('gulp-rename')
var livereload = require('gulp-livereload')
var inject = require('gulp-inject')

// for Dist
var rev = require('gulp-rev')
var ngAnnotate = require('gulp-ng-annotate')
var templateCache = require('gulp-angular-templatecache')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')
var merge = require('merge-stream')
var concat = require('gulp-concat')
var minifyHtml = require('gulp-minify-html')

var config = require('./build.config.js')

gulp.task('vendor', function () {
  var vendors = config.vendors

  var vendorFiles = vendors.map(function (vendor) {
    return vendor.src
  })

  vendorFiles.push('node_modules/font-awesome/**/font-awesome.css')
  vendorFiles.push('node_modules/font-awesome/**/fontawesome-webfont.*')
  vendorFiles.push('node_modules/font-awesome/**/FontAwesome.*')

  return gulp.src(vendorFiles)
    .pipe(gulp.dest('src/browser/vendor'))
})

gulp.task('styl', function () {
  return gulp.src('src/browser/main/styles/app.styl')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(styl())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/browser/main/styles/'))
    .pipe(livereload())
    .pipe(notify('Stylus!!'))
})

gulp.task('bs', function () {
  return gulp.src('src/browser/shared/styles/bootstrap.styl')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(styl())
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/browser/shared/styles'))
    .pipe(notify('Bootstrap compiled!!'))
    .pipe(livereload())
})

gulp.task('inject', function (cb) {
  runSequence(['inject-main', 'inject-popup'], cb)
})

gulp.task('inject-main', function () {
  return gulp.src('src/browser/main/index.inject.html')
    .pipe(inject(gulp.src(['src/browser/main/**/*.js', 'src/browser/main/**/*.css', 'src/browser/shared/**/*.js', 'src/browser/shared/**/*.css'], {read: false}), {
      relative: true
    }))
    .pipe(rename(function (path) {
      path.basename = 'index'
    }))
    .pipe(gulp.dest('src/browser/main/'))
})

gulp.task('watch-main', function () {
  gulp.watch(
    ['src/browser/main/index.inject.html', 'src/browser/main/**/*.js', 'src/browser/main/**/*.css', 'src/browser/shared/**/*.js', 'src/browser/shared/**/*.css'], ['inject-main'])

  gulp.watch('src/browser/main/styles/**/*.styl', ['styl'])
  gulp.watch('src/browser/shared/styles/**/*.styl', ['bs'])
  livereload.listen()
})
gulp.task('inject-popup', function () {
  return gulp.src('src/browser/popup/index.inject.html')
    .pipe(inject(gulp.src(['src/browser/popup/**/*.js', 'src/browser/popup/**/*.css', 'src/browser/shared/**/*.js', 'src/browser/shared/**/*.css'], {read: false}), {
      relative: true
    }))
    .pipe(rename(function (path) {
      path.basename = 'index'
    }))
    .pipe(gulp.dest('src/browser/popup/'))
})

gulp.task('del', function (cb) {
  del(['build/**/*'], cb)
})

gulp.task('default', function (cb) {
  runSequence('del', 'build', 'watch', cb)
})
