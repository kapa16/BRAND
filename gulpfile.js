"use strict";

/* параметры для gulp-autoprefixer */
var autoprefixerList = [
    'Chrome >= 45',
    'Firefox ESR',
    'Edge >= 12',
    'Explorer >= 10',
    'iOS >= 9',
    'Safari >= 9',
    'Android >= 4.4',
    'Opera >= 30'
];
/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        html: 'app/',
        pug: 'app/',
        htmlbeautify: 'app/',
        js: 'app/js/',
        css: 'app/css/',
        img: 'app/img/',
        fonts: 'app/fonts/',
        webfonts: 'app/webfonts/'
    },
    src: {
        html: 'dist/*.html',
        pug: 'dist/pug/*.pug',
        htmlbeautify: 'app/*.html',
        js: 'dist/js/main.js',
        style: 'dist/scss/*.+(scss|sass)',
        img: 'dist/img/**/*.*',
        fonts: 'dist/fonts/**/*.*',
        webfonts: 'dist/webfonts/**/*.*'
    },
    watch: {
        html: 'dist/**/*.html',
        pug: 'dist/pug/**/*.pug',
        htmlbeautify: 'app/*.html',
        js: 'dist/js/**/*.js',
        css: 'dist/scss/**/*.+(scss|sass)',
        img: 'dist/img/**/*.*',
        fonts: 'dist/fonts/**/*.*',
        webfonts: 'dist/webfonts/**/*.*'
    },
    clean: './app'
};
/* настройки сервера */
var config = {
    server: {
        baseDir: './app'
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cache = require('gulp-cache'), // модуль для кэширования
    del = require('del'), // плагин для удаления файлов и каталогов
    pug = require('gulp-pug'),
    htmlbeautify = require('gulp-html-beautify');

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});

// сбор html
gulp.task('html:build', function () {
    gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({stream: true})); // перезагрузка сервера
});

//форматирование html
gulp.task('htmlbeautify', function () {
    let options = {
        indentSize: 4
    };
    gulp.src('app/*.html')
        .pipe(htmlbeautify(options))
        .pipe(gulp.dest('app/'));
});

//сбор pug
gulp.task('pug:build', function () {
    gulp.src(path.src.pug)
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest(path.build.pug))
        .pipe(webserver.reload({stream: true}));
    gulp.run('htmlbeautify');
});

// сбор стилей
gulp.task('css:build', function () {
    gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer({ // добавим префиксы
            browsers: autoprefixerList
        }))
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    gulp.src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({stream: true})); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});
gulp.task('webfonts:build', function () {
    gulp.src(path.src.webfonts)
        .pipe(gulp.dest(path.build.webfonts));
});

// обработка картинок
gulp.task('image:build', function () {
    gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// удаление каталога build 
gulp.task('clean:build', function () {
    del.sync(path.clean);
});

// очистка кэша
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// сборка
gulp.task('build', [
    'clean:build',
    'pug:build',
    'htmlbeautify',
    'html:build',
    'css:build',
    'js:build',
    'fonts:build',
    'webfonts:build',
    'image:build'
]);

// запуск задач при изменении файлов
gulp.task('watch', function () {
    gulp.watch(path.watch.pug, ['pug:build']);
    gulp.watch(path.watch.htmlbeautify, ['htmlbeautify']);
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.css, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
    gulp.watch(path.watch.webfonts, ['webfonts:build']);
});

// задача по умолчанию
gulp.task('default', [
    'clean:build',
    'build',
    'webserver',
    'watch'
]);