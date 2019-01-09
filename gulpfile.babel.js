const gulp = require('gulp');
const watch = require('gulp-watch');
const ghPages = require('gulp-gh-pages-will');
const connect = require('gulp-connect');
const open = require('gulp-open');
require('./gulp/i18n');
require('./gulp/build');
require('./gulp/plato');

gulp.task(
    'connect',
    gulp.series(done => {
        connect.server({
            root      : 'www',
            port      : 8080,
            livereload: true,
        });
        done();
    })
);

gulp.task(
    'open',
    gulp.series(done => {
        gulp.src('www/index.html').pipe(
            open({
                uri: 'http://localhost:8080/',
            })
        );
        done();
    })
);

gulp.task(
    'serve',
    gulp.series('open', 'connect', done => {
        watch(['www/*.html']).pipe(connect.reload());
        done();
    })
);

gulp.task(
    'deploy',
    gulp.series('build-min', () =>
        gulp.src(['404.md', 'LICENSE', 'README.md', 'CNAME', './www/**', './branch/**', './old/**']).pipe(ghPages())
    )
);

gulp.task('test-deploy', gulp.series('build-min', 'serve', () => {}));

gulp.task(
    'watch-static',
    gulp.parallel(done => {
        gulp.watch(
            ['static/xml/**/*', 'static/*.html', 'static/css/*.scss'],
            {
                debounceTimeout: 1000,
            },
            gulp.series('build-dev-static')
        );
        done();
    })
);

gulp.task(
    'watch-html',
    gulp.series(done => {
        gulp.watch(
            ['templates/**/*'],
            {
                debounceTimeout: 1000,
            },
            gulp.series('build-dev-html')
        );
        done();
    })
);

gulp.task('watch', gulp.series('build', 'serve', 'watch-static', 'watch-html'));

gulp.task('default', gulp.series('watch'));
