require('dotenv').load()
var env = process.env

var gulp = require('gulp')
var styl = require('gulp-stylus')
var autoprefixer = require('gulp-autoprefixer')
var templateCache = require('gulp-angular-templatecache')
var globby = require('globby')
var template = require('gulp-template')
var del = require('del')
var runSequence = require('run-sequence')
var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var changed = require('gulp-changed')
var livereload = require('gulp-livereload')

// for Dist
var rev = require('gulp-rev')
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')
var merge = require('merge-stream')
var concat = require('gulp-concat')
var streamqueue = require('streamqueue')
var minifyHtml = require('gulp-minify-html')

var config = require('./build.config.js')

gulp.task('js', function () {
  return streamqueue({objectMode: true},
    gulp.src('tpls/env.js')
      .pipe(template({
        apiUrl: env.BUILD_API_URL
      })),
    gulp.src(['src/**/*.js'])
  )
  .pipe(changed('build'))
  .pipe(gulp.dest('build'))
})

gulp.task('dist', function () {
  var js = streamqueue({objectMode: true},
    gulp.src(['src/**/*.js']),
    gulp.src('tpls/env.js')
      .pipe(template({
        apiUrl: env.DIST_API_URL
      })),
    gulp.src('src/**/*.tpl.html')
      .pipe(templateCache())
  )
  .pipe(ngAnnotate())
  .pipe(uglify())
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist'))

  var css = gulp.src('src/styles/main.styl')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(styl())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist'))

  var index = gulp.src('src/index.html')
      .pipe(template({
        scripts: ['app.js'],
        styles: ['main.css'],
        env: 'dist'
      }))
      .pipe(minifyHtml())
      .pipe(gulp.dest('dist'))

  return merge(js, css, index)
})

gulp.task('styl', function () {
  return gulp.src('src/styles/main.styl')
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(styl())
    .pipe(autoprefixer())
    .pipe(gulp.dest('build'))
    .pipe(notify('Stylus!!'))
    .pipe(livereload())
})

gulp.task('tpls', function () {
  return gulp.src('src/**/*.tpl.html')
    .pipe(templateCache())
    .pipe(notify('Tpls Done!! :)'))
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

  vendorFiles.push('node_modules/font-awesome/**/font-awesome.css')
  vendorFiles.push('node_modules/font-awesome/**/fontawesome-webfont.*')
  vendorFiles.push('node_modules/font-awesome/**/FontAwesome.*')

  return gulp.src(vendorFiles)
    .pipe(gulp.dest('build/vendor'))
})

gulp.task('resources', function () {
  return gulp.src('resources/**/*')
    .pipe(changed('build/resources'))
    .pipe(gulp.dest('build/resources'))
})

gulp.task('build', function (cb) {
  runSequence(['js', 'styl', 'tpls', 'vendor', 'resources'], 'index', cb)
})

gulp.task('watch', function (cb) {
  gulp.watch(['.env', 'tpls/env.js', 'src/**/*.js'], ['js'])

  gulp.watch('src/styles/**/*.styl', ['styl'])

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

require('./gulp-electron')(gulp)
