var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var templateCache = require('gulp-angular-templatecache')
var globby = require('globby')
var template = require('gulp-template')
var concat = require('gulp-concat')

var del = require('del')
var runSequence = require('run-sequence')

var rev = require('gulp-rev')
var merge = require('merge-stream')

var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')

var livereload = require('gulp-livereload')

var config = require('./build.config.js')

gulp.task('js', function(){
  return gulp.src(['src/**/*.js']).pipe(gulp.dest('build'))
})

gulp.task('sass', function () {
  return gulp.src('src/**/*.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('build'))
    .pipe(livereload())
})

gulp.task('tpls', function(){
  return gulp.src('src/**/*.tpl.html')
    .pipe(templateCache())
    .pipe(gulp.dest('build'))
})

gulp.task('index', function () {
  var files = globby.sync(['build/**/*', '!build/vendor/**/*'])

  var filter = function (files, ext) {
    return files.filter(function (file) {
      var reg = new RegExp('.+\.' + ext + '$')
      return file.match(reg)
    }).map(function (file) {
      return file.replace('build/', '')
    })
  }
  var scripts = filter(files, 'js')
  var styles = filter(files, 'css')

  return gulp.src('src/index.html')
    .pipe(template({
      scripts: scripts,
      styles: styles,
      env: 'build'
    }))
    .pipe(gulp.dest('build'))
    .pipe(livereload())
})

gulp.task('build', function (cb) {
  runSequence(['js', 'sass', 'tpls', 'vendor'], 'index', cb)
})

gulp.task('watch', function (cb) {
  gulp.watch(['src/**/*.js'], ['js'])

  gulp.watch('src/**/*.scss', ['sass'])

  gulp.watch('src/**/*.tpl.html', ['tpls'])

  gulp.watch(['build/**/*.js', 'src/index.html'], ['index'])

  livereload.listen()
})

gulp.task('del', function (cb) {
  del(['build/**/*'], cb)
})

gulp.task('default', function (cb) {
  runSequence('del', 'build', 'watch', cb)
})

gulp.task('vendor', function () {
  var vendors = config.vendors

  vendorFiles = vendors.map(function (vendor) {
    return vendor.src
  })

  return gulp.src(vendorFiles)
    .pipe(gulp.dest('build/vendor'))
})
