var gulp = require('gulp')
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var templateCache = require('gulp-angular-templatecache')
var globby = require('globby')
var template = require('gulp-template')
var concat = require('gulp-concat')
var del = require('del')
var runSequence = require('run-sequence')
var merge = require('merge-stream')

var changed = require('gulp-changed')
var cached = require('gulp-cached')
var remember = require('gulp-remember')
var livereload = require('gulp-livereload')
var childProcess = require('child_process')

// for Dist
var rev = require('gulp-rev')
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')

var config = require('./build.config.js')

gulp.task('js', function(){
  return gulp.src(['src/**/*.js'])
    .pipe(changed('build'))
    .pipe(gulp.dest('build'))
})

gulp.task('sass', function () {
  return gulp.src('src/**/*.scss')
    .pipe(cached('styles'))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(remember('styles'))
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

gulp.task('vendor', function () {
  var vendors = config.vendors

  var vendorFiles = vendors.map(function (vendor) {
    return vendor.src
  })

  return gulp.src(vendorFiles)
    .pipe(gulp.dest('build/vendor'))
})

gulp.task('resources', function () {
  return gulp.src('resources/**/*')
    .pipe(changed('build/resources'))
    .pipe(gulp.dest('build/resources'))
})

gulp.task('build', function (cb) {
  runSequence(['js', 'sass', 'tpls', 'vendor', 'resources'], 'index', cb)
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
  var spawn = childProcess.spawn('http-server', ['build'])
  spawn.stdout.on('data', function (data) {
    console.log('OUT: ' + data)
  })
  spawn.stderr.on('data', function (data) {
    console.log('ERR: ' + data)
  })

  runSequence('del', 'build', 'watch', cb)
})
