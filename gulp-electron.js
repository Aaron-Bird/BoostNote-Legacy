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

var config = require('./build.config.js')

// for Dist
var rev = require('gulp-rev')
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')
var minifyCss = require('gulp-minify-css')

module.exports = function (gulp) {


  /*
  * Electron build
  */
  gulp.task('elec-js', function(){
    var src = gulp.src(['src/**/*.js'])
      .pipe(changed('electron_build'))
      .pipe(gulp.dest('electron_build'))
    var elecSrc = gulp.src(['electron_src/**/*.js'])
      .pipe(changed('electron_build/electron'))
      .pipe(gulp.dest('electron_build/electron'))
    var elecHtml = gulp.src(['electron_src/**/*.html'])
      .pipe(changed('electron_build/electron'))
      .pipe(gulp.dest('electron_build/electron'))

    return merge(src, elecSrc, elecHtml)
  })

  gulp.task('elec-sass', function () {
    return gulp.src(['src/**/*.scss', 'electron_src/**/*.scss'])
      .pipe(cached('styles'))
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(remember('styles'))
      .pipe(concat('all.css'))
      .pipe(gulp.dest('electron_build'))
  })

  gulp.task('elec-tpls', function(){
    return gulp.src('src/**/*.tpl.html')
      .pipe(templateCache())
      .pipe(gulp.dest('electron_build'))
  })

  gulp.task('elec-index', function () {
    var files = globby.sync(['electron_build/**/*', '!electron_build/vendor/**/*', '!electron_build/electron/**/*'])

    var filter = function (files, ext) {
      return files.filter(function (file) {
        var reg = new RegExp('.+\.' + ext + '$')
        return file.match(reg)
      }).map(function (file) {
        return file.replace('electron_build/', '')
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
      .pipe(gulp.dest('electron_build'))
  })

  gulp.task('elec-vendor', function () {
    var vendors = config.vendors

    var vendorFiles = vendors.map(function (vendor) {
      return vendor.src
    })

    return gulp.src(vendorFiles)
      .pipe(gulp.dest('electron_build/vendor'))
  })

  gulp.task('elec-resources', function () {
    return gulp.src('resources/**/*')
      .pipe(changed('electron_build/resources'))
      .pipe(gulp.dest('electron_build/resources'))
  })

  gulp.task('elec-build', function (cb) {
    runSequence(['elec-js', 'elec-sass', 'elec-tpls', 'elec-vendor', 'elec-resources'], 'elec-index', cb)
  })

  gulp.task('elec-watch', function (cb) {
    gulp.watch(['src/**/*.js', 'electron_src/**/*.js', 'electron_src/**/*.html'], ['elec-js'])

    gulp.watch(['src/**/*.scss', 'electron_src/**/*.scss'], ['elec-sass'])

    gulp.watch('src/**/*.tpl.html', ['elec-tpls'])

    gulp.watch(['electron_build/**/*', '!electron_build/vendor/**/*', '!electron_build/electron/**/*'], ['elec-index'])

    livereload.listen()
  })

  gulp.task('elec-del', function (cb) {
    del(['electron_build/**/*'], cb)
  })

  gulp.task('elec', function (cb) {
    runSequence('elec-del', 'elec-build', 'elec-watch', cb)
  })

}
