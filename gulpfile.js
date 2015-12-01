
    var gulp = require('gulp');
    var browserify = require('browserify');
    var babelify = require('babelify');
    var source = require('vinyl-source-stream');

    gulp.task('es2015', function() {
        return browserify({ entries: './es6/src/vanilla.js', debug: true })
            .transform(babelify, { presets: ['es2015'] })
            .bundle()
            .pipe(source('vanilla.js'))
            .pipe(gulp.dest('./es6/dist'))
    });

    gulp.task('test-es2015', function() {
        return browserify({ entries: './test/js/test.js', debug: true })
        .transform(babelify, { presets: ['es2015'] })
        .bundle()
        .pipe(source('test.js'))
        .pipe(gulp.dest('./test'))
    });

    gulp.task('build', ['es2015', 'test-es2015']);