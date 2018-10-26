var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('dist/scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
});
