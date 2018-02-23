'use strict'

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt)

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      desktopLinux: {
        command: 'sed s/VERSION/<%= pkg.version %>/g < build/desktop > build/.desktop'
      },
      appConfig: {
        command: 'node ./util/buildAppConfig.js'
      },
      clean: {
        command: 'rm -Rf bower_components node_modules'
      },
      cordovaclean: {
        command: 'make -C cordova clean'
      },
      macos: {
        command: 'sh build/build-macos.sh sign'
      },
      coveralls: {
        command: 'cat  coverage/report-lcov/lcov.info |./node_modules/coveralls/bin/coveralls.js'
      },
      chrome: {
        command: 'make -C chrome-app '
      },
      wpinit: {
        command: 'make -C cordova wp-init'
      },
      wpcopy: {
        command: 'make -C cordova wp-copy'
      },
      iosdebug: {
        command: 'npm run build:ios'
      },
      ios: {
        command: 'npm run build:ios-release'
      },
      xcode: {
        command: 'npm run open:ios'
      },
      androiddebug: {
        command: 'npm run build:android'
      },
      android: {
        command: 'npm run build:android-release'
      },
      androidrun: {
        command: 'npm run run:android && npm run log:android'
      },
      androidbuild: {
        command: 'cd cordova/project && cordova build android --release'
      },
      androidsign: {
        command: 'rm -f cordova/project/platforms/android/build/outputs/apk/release/android-release-signed-aligned.apk; jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../canoe.keystore -signedjar cordova/project/platforms/android/build/outputs/apk/release/android-release-signed.apk  cordova/project/platforms/android/build/outputs/apk/release/android-release-unsigned.apk canoe && ../android-sdk-macosx/build-tools/21.1.1/zipalign -v 4 cordova/project/platforms/android/build/outputs/apk/release/android-release-signed.apk cordova/project/platforms/android/build/outputs/apk/release/android-release-signed-aligned.apk ',
        stdin: true
      },
      desktopsign: {
        cmd: 'gpg -u 2357B81F --output build/canoe-linux64-<%= pkg.version %>.zip.sig --detach-sig build/canoe-linux64-<%= pkg.version %>.zip ; gpg -u 2357B81F --output build/canoe-win64-<%= pkg.version %>.zip.sig --detach-sig build/canoe-win64-<%= pkg.version %>.zip ; gpg -u 2357B81F --output build/canoe-osx64-<%= pkg.version %>.zip.sig --detach-sig build/canoe-osx64-<%= pkg.version %>.zip'
      },
      desktopverify: {
        cmd: 'gpg --verify build/canoe-linux64-<%= pkg.version %>.zip.sig build/canoe-linux64-<%= pkg.version %>.zip; gpg --verify build/canoe-win64-<%= pkg.version %>.zip.sig build/canoe-win64-<%= pkg.version %>.zip ; gpg --verify build/canoe-osx64-<%= pkg.version %>.zip.sig build/canoe-osx64-<%= pkg.version %>.zip'
      },
      osxsign: {
        cmd: 'gpg -u 2357B81F --output build/canoe.dmg.sig --detach-sig build/canoe.dmg'
      }
    },
    watch: {
      options: {
        dateFormat: function (time) {
          grunt.log.writeln('The watch finished in ' + time + 'ms at ' + (new Date()).toString())
          grunt.log.writeln('Waiting for more changes...')
        }
      },
      sass: {
        files: ['src/sass/**/**/*.scss'],
        tasks: ['sass']
      },
      main: {
        files: [
          'src/js/init.js',
          'src/js/app.js',
          'src/js/raiwallet.js',
          'src/js/directives/*.js',
          'src/js/filters/*.js',
          'src/js/routes.js',
          'src/js/services/*.js',
          'src/js/models/*.js',
          'src/js/controllers/**/*.js'
        ],
        tasks: ['concat:js']
      },
      gettext: {
        files: [
          'i18n/po/*.po',
          'i18n/po/*.pot'
        ],
        tasks: ['nggettext_compile', 'concat']
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compact',
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          flatten: true,
          src: ['src/sass/main.scss'],
          dest: 'www/css/',
          ext: '.css'
        }]
      }
    },
    concat: {
      options: {
        sourceMap: false,
        sourceMapStyle: 'link' // embed, link, inline
      },
      angular: {
        src: [
          'bower_components/qrcode-generator/js/qrcode.js',
          'bower_components/qrcode-generator/js/qrcode_UTF8.js',
          'bower_components/moment/min/moment-with-locales.js',
          'bower_components/angular-moment/angular-moment.js',
          'bower_components/ng-lodash/build/ng-lodash.js',
          'bower_components/angular-qrcode/angular-qrcode.js',
          'bower_components/angular-gettext/dist/angular-gettext.js',
          'bower_components/ng-csv/build/ng-csv.js',
          'bower_components/ionic-toast/dist/ionic-toast.bundle.min.js',
          'bower_components/angular-clipboard/angular-clipboard.js',
          'bower_components/angular-md5/angular-md5.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'bower_components/ngtouch/src/ngTouch.js',
          'bower_components/string.startsWith/src/string.startsWith.js'
        ],
        dest: 'www/lib/angular-components.js'
      },
      js: {
        src: [
          'src/js/app.js',
          'src/js/routes.js',
          'src/js/directives/*.js',
          'src/js/filters/*.js',
          'src/js/models/*.js',
          'src/js/services/*.js',
          'src/js/controllers/**/*.js',
          'src/js/translations.js',
          'src/js/appConfig.js',
          'src/js/init.js',
          'node_modules/bezier-easing/dist/bezier-easing.min.js',
          'node_modules/cordova-plugin-qrscanner/dist/cordova-plugin-qrscanner-lib.min.js'
        ],
        dest: 'www/js/app.js'
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      prod: {
        files: {
          'www/js/app.js': ['www/js/app.js'],
          'www/lib/angular-components.js': ['www/lib/angular-components.js']
        }
      }
    },
    nggettext_extract: {
      pot: {
        files: {
          'i18n/po/template.pot': [
            'www/index.html',
            'www/views/**/*.html',
            'src/js/routes.js',
            'src/js/services/*.js',
            'src/js/controllers/**/*.js'
          ]
        }
      }
    },
    nggettext_compile: {
      all: {
        options: {
          module: 'canoeApp'
        },
        files: {
          'src/js/translations.js': ['i18n/po/*.po']
        }
      }
    },
    copy: {
      ionic_fonts: {
        expand: true,
        flatten: true,
        src: 'bower_components/ionic/release/fonts/ionicons.*',
        dest: 'www/fonts/'
      },
      ionic_js: {
        expand: true,
        flatten: true,
        src: 'bower_components/ionic/release/js/ionic.bundle.min.js',
        dest: 'www/lib/'
      },
      linux: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['.desktop', '../www/img/app/favicon.ico', '../resources/canoe/linux/512x512.png'],
          dest: 'build/canoe/linux64/',
          flatten: true,
          filter: 'isFile'
        }]
      }
    },
    nwjs: {
      options: {
        platforms: ['win64', 'osx64', 'linux64'],
        flavor: 'normal',
        version: '0.28.2',
        macIcns: './resources/canoe/mac/app.icns',
        exeIco: './www/img/app/logo.ico',
        macPlist: {
          'CFBundleURLTypes': [
            {
              'CFBundleURLName': 'URI Handler',
              'CFBundleURLSchemes': ['nano', 'canoe']
            }
          ]
        }
      },
      src: ['./package.json', './www/**/*']
    },
    compress: {
      linux: {
        options: {
          archive: './build/canoe-linux64-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: './build/canoe/linux64/',
        src: ['**/*'],
        dest: 'canoe-linux64-<%= pkg.version %>'
      },
      win: {
        options: {
          archive: './build/canoe-win64-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: './build/canoe/win64/',
        src: ['**/*'],
        dest: 'canoe-win64-<%= pkg.version %>/'
      },
      osx: {
        options: {
          archive: './build/canoe-osx64-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: './build/canoe/osx64/',
        src: ['**/*'],
        dest: 'canoe-osx64-<%= pkg.version %>/'
      }
    },
    browserify: {
      dist: {
        files: {
          'www/raiwallet/braiwallet.js': ['src/js/raiwallet.js']
        }
      }
    }
  })

  grunt.registerTask('default', ['nggettext_compile', 'exec:appConfig', 'browserify', 'sass', 'concat', 'copy:ionic_fonts', 'copy:ionic_js'])
  grunt.registerTask('prod', ['default', 'uglify'])
  grunt.registerTask('translate', ['nggettext_extract'])
  grunt.registerTask('desktop', ['prod', 'nwjs', 'exec:desktopLinux', 'copy:linux', 'compress'])
  grunt.registerTask('osx', ['prod', 'nwjs', 'exec:macos', 'exec:osxsign'])
  grunt.registerTask('osx-debug', ['default', 'nwjs'])
  grunt.registerTask('chrome', ['default', 'exec:chrome'])
  grunt.registerTask('wp', ['prod', 'exec:wp'])
  grunt.registerTask('wp-copy', ['default', 'exec:wpcopy'])
  grunt.registerTask('wp-init', ['default', 'exec:wpinit'])
  grunt.registerTask('ios', ['exec:ios'])
  grunt.registerTask('ios-debug', ['exec:iosdebug'])
  grunt.registerTask('ios-run', ['exec:xcode'])
  grunt.registerTask('cordovaclean', ['exec:cordovaclean'])
  grunt.registerTask('android-debug', ['exec:androiddebug', 'exec:androidrun'])
  grunt.registerTask('android', ['exec:android'])
  grunt.registerTask('android-release', ['prod', 'exec:android', 'exec:androidsign'])
  grunt.registerTask('desktopsign', ['exec:desktopsign', 'exec:desktopverify'])
}
