
    var
        gulp = require('gulp'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        connect = require('gulp-connect'),
        browserify = require('browserify'),
        babelify = require('babelify'),
        source = require('vinyl-source-stream'),
        vbuffer = require('vinyl-buffer'),
        del = require('del')
    ;

    var config = {
        paths: {
            src: {
                main: './src',
                es5: '/es5',
                es2015: '/es2015'
            },
            dist: {
                main: './test',
                es5: '/es5',
                es2015: '/es2015',
                js: '/js'
            }
        },
        port: 3337
    };

    gulp.task('clean', function() {
        return del(['./test/es2015/js/dist', './test/es5/js/dist']);
    });

    //Start local server
    gulp.task('connect', function() {
       connect.server({
           root: ['test'],
           port: config.port,
           base: 'http://localhost',
           livereload: true
       });
    });

    gulp.task('test-es2015', function() {
        return browserify({ entries: './test/es2015/js/test.js', debug: true })
            .transform(babelify, { presets: ['es2015'] })
            .bundle()
            .pipe(source('test.js'))
            .pipe(vbuffer())
            .pipe(uglify())
            .pipe(rename({
                basename: 'index',
                suffix: '.min',
                extname: '.js'
            }))
            .pipe(gulp.dest('./test/js/dist'))
            .pipe(connect.reload());
        ;
    });

    gulp.task('test-es5', function() {
        return gulp.src(['./src/es5/vanilla.js', './test/es5/js/test.js'])
            .pipe(concat('index.js'))
            .pipe(gulp.dest('./test/es5/js/dist'))
            .pipe(rename({
                basename: 'index',
                suffix: '.min',
                extname: '.js'
            }))
            .pipe(uglify())
            .pipe(gulp.dest('./test/es5/js/dist'))
            .pipe(connect.reload());
        ;
    });

    gulp.task('build', ['clean', 'test-es2015', 'test-es5']);

    gulp.task('watch', function() {
        gulp.watch('./src/*/**.js', ['build']);
        gulp.watch('./test/*/js/**.js', ['build']);
    });

    gulp.task('default', function() {
        gulp.start('build');
        gulp.start('connect');
        gulp.start('watch');
    });