require('dotenv').load()
var env = process.env

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
var merge = require('merge-stream')

var config = require('./build.config.js')

module.exports = function (gulp) {

  gulp.task('elec-env', function () {
    return gulp.src('tpls/env.js')
      .pipe(template({
        apiUrl: env.BUILD_API_URL
      }))
      .pipe(gulp.dest('electron_build/config'))
  })

  gulp.task('elec-js', function () {
    var main = gulp.src('src/**/*.js')
      .pipe(changed('electron_build'))
      .pipe(gulp.dest('electron_build'))

    var electron = gulp.src('electron_src/**/*.js')
      .pipe(changed('electron_build/electron'))
      .pipe(gulp.dest('electron_build/electron'))

    return merge(main, electron)
  })

  gulp.task('elec-styl', function () {
    return gulp.src('electron_src/styles/main.styl')
      .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
      .pipe(styl())
      .pipe(autoprefixer())
      .pipe(gulp.dest('electron_build'))
      .pipe(notify('Stylus!!'))
      .pipe(livereload())
  })

  gulp.task('elec-tpls', function () {
    var main = gulp.src('src/**/*.tpl.html')
      .pipe(templateCache())
      .pipe(gulp.dest('electron_build'))

    var electron = gulp.src('electron_src/**/*.tpl.html')
      .pipe(templateCache())
      .pipe(gulp.dest('electron_build/electron'))

    return merge(main, electron)
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

    var main = gulp.src('src/index.html')
      .pipe(template({
        scripts: scripts,
        styles: styles,
        env: env
      }))
      .pipe(gulp.dest('electron_build'))
      .pipe(livereload())

    var electron = gulp.src('electron_src/**/index.html')
      .pipe(gulp.dest('electron_build/electron'))

    return merge(main, electron)
  })

  gulp.task('elec-vendor', function () {
    var vendors = config.vendors

    var vendorFiles = vendors.map(function (vendor) {
      return vendor.src
    })

    vendorFiles.push('node_modules/font-awesome/**/font-awesome.css')
    vendorFiles.push('node_modules/font-awesome/**/fontawesome-webfont.*')
    vendorFiles.push('node_modules/font-awesome/**/FontAwesome.*')

    return gulp.src(vendorFiles)
      .pipe(gulp.dest('electron_build/vendor'))
  })

  gulp.task('elec-resources', function () {
    return gulp.src('resources/**/*')
      .pipe(changed('electron_build/resources'))
      .pipe(gulp.dest('electron_build/resources'))
  })

  gulp.task('elec-build', function (cb) {
    runSequence(['elec-env', 'elec-js', 'elec-styl', 'elec-tpls', 'elec-vendor', 'elec-resources'], 'elec-index', cb)
  })

  gulp.task('elec-watch', function (cb) {
    gulp.watch(['.env', 'tpls/env.js'], ['elec-env'])

    gulp.watch(['src/**/*.js', 'electron_src/**/*.js'], ['elec-js'])

    gulp.watch(['src/styles/**/*.styl', 'electron_src/styles/**/*.styl'], ['elec-styl'])

    gulp.watch('src/**/*.tpl.html', ['elec-tpls'])

    gulp.watch(['electron_build/**/*.js', 'src/index.html', 'src/index.html', 'electron_src/**/index.html'], ['elec-index'])

    livereload.listen()
  })

  gulp.task('elec-del', function (cb) {
    del(['electron_build/**/*'], cb)
  })

  gulp.task('elec', function (cb) {
    runSequence('elec-del', 'elec-build', 'elec-watch', cb)
  })

}
