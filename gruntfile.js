const path = require('path')
const ChildProcess = require('child_process')
const packager = require('electron-packager')
const archiver = require('archiver')
const fs = require('fs')
const appdmg = require('appdmg')

module.exports = function (grunt) {
  var initConfig = {
    pkg: grunt.file.readJSON('package.json'),
    'create-windows-installer': {
      x64: {
        appDirectory: path.join(__dirname, 'dist', 'Boostnote-win32-x64'),
        outputDirectory: path.join(__dirname, 'dist'),
        authors: 'MAISIN&CO., Inc.',
        exe: 'Boostnote.exe',
        loadingGif: path.join(__dirname, 'resources/boostnote-install.gif'),
        iconUrl: path.join(__dirname, 'resources/app.ico'),
        setupIcon: path.join(__dirname, 'resources/dmg.ico'),
        certificateFile: grunt.config.get('auth_code.win_cert_path'),
        certificatePassword: grunt.config.get('auth_code.win_cert_pw'),
        noMsi: true
      }
    }
  }
  if (process.platform === 'win32') initConfig.auth_code = grunt.file.readJSON('secret/auth_code.json')
  grunt.initConfig(initConfig)

  grunt.loadNpmTasks('grunt-electron-installer')

  grunt.registerTask('compile', function () {
    var done = this.async()
    var execPath = path.join('node_modules', '.bin', 'webpack') + ' --config webpack.config.production.js'
    grunt.log.writeln(execPath)
    ChildProcess.exec(execPath,
      {
        env: Object.assign({}, process.env, {
          BABEL_ENV: 'production'
        })
      },
      function (err, stdout, stderr) {
        grunt.log.writeln(stdout)

        if (err) {
          grunt.log.writeln(err)
          grunt.log.writeln(stderr)
          done(false)
          return
        }
        done()
      }
    )
  })

  grunt.registerTask('zip', function (platform) {
    var done = this.async()
    switch (platform) {
      case 'win':
        var archive = archiver.create('zip', {})
        var basename = 'Boostnote-installer-win32-x64'
        archive.file(path.join('dist/Setup.exe'), {
          name: basename + '.exe'
        })
        archive.finalize()
        var writeStream = fs.createWriteStream(path.join('dist/' + basename + '.zip'))
        archive.pipe(writeStream)
        writeStream.on('close', function () {
          grunt.log.writeln('Zipped!')
          done()
        })
        break
      case 'osx':

        var execPath = 'zip -r -y -q dist/Boostnote.zip dist/Boostnote-darwin-x64/Boostnote.app'
        grunt.log.writeln(execPath)
        ChildProcess.exec(execPath,
          function (err, stdout, stderr) {
            grunt.log.writeln(stdout)

            if (err) {
              grunt.log.writeln(err)
              grunt.log.writeln(stderr)
              done(false)
              return
            }
            done()
          }
        )
        break
      default:
        done()
        return
    }
  })

  grunt.registerTask('pack', function (platform) {
    grunt.log.writeln(path.join(__dirname, 'dist'))
    var done = this.async()
    var opts = {
      name: 'Boostnote',
      arch: 'x64',
      dir: __dirname,
      version: grunt.config.get('pkg.config.electron-version'),
      'app-version': grunt.config.get('pkg.version'),
      'app-bundle-id': 'com.maisin.boost',
      asar: true,
      prune: true,
      overwrite: true,
      out: path.join(__dirname, 'dist'),
      ignore: /submodules\/ace\/(?!src-min)|submodules\/ace\/(?=src-min-noconflict)|node_modules\/devicon\/icons|dist|.env/
    }
    switch (platform) {
      case 'win':
        Object.assign(opts, {
          platform: 'win32',
          icon: path.join(__dirname, 'resources/app.ico'),
          'version-string': {
            CompanyName: 'MAISIN&CO., Inc.',
            LegalCopyright: '© 2015 MAISIN&CO., Inc. All rights reserved.',
            FileDescription: 'Boostnote',
            OriginalFilename: 'Boostnote',
            FileVersion: grunt.config.get('pkg.version'),
            ProductVersion: grunt.config.get('pkg.version'),
            ProductName: 'Boostnote',
            InternalName: 'Boostnote'
          }
        })
        packager(opts, function (err, appPath) {
          if (err) {
            grunt.log.writeln(err)
            done(err)
            return
          }
          done()
        })
        break
      case 'osx':
        Object.assign(opts, {
          platform: 'darwin',
          icon: path.join(__dirname, 'resources/app.icns'),
          'app-category-type': 'public.app-category.developer-tools'
        })
        packager(opts, function (err, appPath) {
          if (err) {
            grunt.log.writeln(err)
            done(err)
            return
          }
          done()
        })
        break
    }
  })

  grunt.registerTask('codesign', function (platform) {
    var done = this.async()
    if (process.platform !== 'darwin') {
      done(false)
      return
    }

    ChildProcess.exec('codesign --verbose --deep --force --sign \"\" dist/Boostnote-darwin-x64/Boostnote.app', function (err, stdout, stderr) {
      grunt.log.writeln(stdout)

      if (err) {
        grunt.log.writeln(err)
        grunt.log.writeln(stderr)
        done(false)
        return
      }
      done()
    })
  })

  grunt.registerTask('create-osx-installer', function () {
    var done = this.async()

    var stream = appdmg({
      target: 'dist/Boostnote-darwin-x64.dmg',
      basepath: __dirname,
      specification: {
        'title': 'Boostnote',
        'icon': 'resources/dmg.icns',
        'background': 'resources/boostnote-install.png',
        'icon-size': 80,
        'contents': [
          { 'x': 448, 'y': 344, 'type': 'link', 'path': '/Applications' },
          { 'x': 192, 'y': 344, 'type': 'file', 'path': 'dist/Boostnote-darwin-x64/Boostnote.app' }
        ]
      }
    })
    stream.on('finish', function () {
      done()
    })

    stream.on('error', function (err) {
      grunt.log.writeln(err)
      done(false)
    })
  })

  grunt.registerTask('build', function (platform) {
    if (!platform) {
      platform = process.platform === 'darwin' ? 'osx' : process.platform === 'win32' ? 'win' : null
    }
    switch (platform) {
      case 'win':
        grunt.task.run(['pack:win', 'create-windows-installer', 'zip:win'])
        break
      case 'osx':
        grunt.task.run(['pack:osx', 'codesign', 'create-osx-installer', 'zip:osx'])
        break
    }
  })

  // Default task(s).
  grunt.registerTask('default', ['build'])
}
