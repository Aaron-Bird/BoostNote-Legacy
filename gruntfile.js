const path = require('path')
const ChildProcess = require('child_process')
const packager = require('electron-packager')

module.exports = function (grunt) {
  var auth_code
  try {
    auth_code = grunt.file.readJSON('secret/auth_code.json')
  } catch (e) {
    if (e.origError.code === 'ENOENT') {
      console.warn('secret/auth_code.json is not found. CodeSigning is not available.')
    }
  }
  const OSX_COMMON_NAME = auth_code != null ? auth_code.OSX_COMMON_NAME : ''
  const WIN_CERT_PASSWORD = auth_code != null ? auth_code.WIN_CERT_PASSWORD : ''

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
        certificateFile: path.join(__dirname, 'secret', 'authenticode_cer.p12'),
        certificatePassword: WIN_CERT_PASSWORD,
        noMsi: true
      }
   },
  'electron-installer-debian': {
      app: {
        options: {
          arch: 'amd64',
          categories: [
              'Development',
              'Utility'
          ],
          icon: path.join(__dirname, 'resources/app.png'),
          bin: 'Boostnote'
        },
        src: path.join(__dirname, 'dist', 'Boostnote-linux-x64'),
        dest: path.join(__dirname, 'dist')
      }
    }
  }

  grunt.initConfig(initConfig)
  grunt.loadNpmTasks('grunt-electron-installer')
  grunt.loadNpmTasks('grunt-electron-installer-debian')

  grunt.registerTask('compile', function () {
    var done = this.async()
    var execPath = path.join('node_modules', '.bin', 'webpack') + ' --config webpack-production.config.js'
    grunt.log.writeln(execPath)
    ChildProcess.exec(execPath,
      {
        env: Object.assign({}, process.env, {
          BABEL_ENV: 'production',
          NODE_ENV: 'production'
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
      ignore: /submodules\/ace\/(?!src-min)|submodules\/ace\/(?=src-min-noconflict)|node_modules\/devicon\/icons|dist|^\/browser|^\/secret|\.babelrc|\.gitignore|^\/\.gitmodules|^\/gruntfile|^\/readme.md|^\/webpack|^\/appdmg\.json/
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
      case 'linux':
        Object.assign(opts, {
          platform: 'linux',
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

    ChildProcess.exec(`codesign --verbose --deep --force --sign \"${OSX_COMMON_NAME}\" dist/Boostnote-darwin-x64/Boostnote.app`,
      function (err, stdout, stderr) {
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
    var execPath = 'appdmg appdmg.json dist/Boostnote-mac.dmg'
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
      })
  })

  grunt.registerTask('zip', function (platform) {
    var done = this.async()
    switch (platform) {
      case 'osx':
        var execPath = 'cd dist/Boostnote-darwin-x64 && zip -r -y -q ../Boostnote-mac.zip Boostnote.app'
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

  grunt.registerTask('build', function (platform) {
    if (!platform) {
      platform = process.platform === 'darwin' ? 'osx' : process.platform === 'win32' ? 'win' : null
    }
    switch (platform) {
      case 'win':
        grunt.task.run(['compile', 'pack:win', 'create-windows-installer'])
        break
      case 'osx':
        grunt.task.run(['compile', 'pack:osx', 'codesign', 'create-osx-installer', 'zip:osx'])
        break
      case 'linux':
        grunt.task.run(['compile', 'pack:linux', 'electron-installer-debian'])
        break;
    }
  })

  grunt.registerTask('pre-build', function (platform) {
    if (!platform) {
      platform = process.platform === 'darwin' ? 'osx' : process.platform === 'win32' ? 'win' : null
    }
    switch (platform) {
      case 'win':
        grunt.task.run(['compile', 'pack:win'])
        break
      case 'osx':
        grunt.task.run(['compile', 'pack:osx'])
        break
    }
  })

  grunt.registerTask('default', ['build'])
}
