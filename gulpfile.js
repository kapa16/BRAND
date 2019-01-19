"use strict";

const gulpVersion = 3;

/* параметры для gulp-autoprefixer */
const autoPrefixList = [
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
const path = {
  build: {
    html: 'app/',
    pug: 'app/',
    js: 'app/js/',
    css: 'app/css/',
    img: 'app/img/',
    fonts: 'app/fonts/',
    webFonts: 'app/webfonts/'
  },
  src: {
    html: 'dist/*.html',
    pug: 'dist/pug/*.pug',
    js: 'dist/js/**/*.js',//main.js',
    style: 'dist/scss/*.+(scss|sass)',
    img: 'dist/img/**/*.*',
    fonts: 'dist/fonts/**/*.*',
    webFonts: 'dist/webfonts/**/*.*'
  },
  watch: {
    html: 'dist/**/*.html',
    pug: 'dist/pug/**/*.pug',
    js: 'dist/js/**/*.js',
    css: 'dist/scss/**/*.+(scss|sass)',
    img: 'dist/img/**/*.*',
    fonts: 'dist/fonts/**/*.*',
    webFonts: 'dist/webfonts/**/*.*'
  },
  clean: './app'
};
/* настройки сервера */
const config = {
  server: {
    baseDir: './app'
  },
  notify: false
};

/* подключаем gulp и плагины */
const gulp = require('gulp'),  // подключаем Gulp
  sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
  webServer = require('browser-sync'), // сервер для работы и автоматического обновления страниц
  concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
  uglify = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
  cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
  del = require('del'), // плагин для удаления файлов и каталогов
  imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
  pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
  rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
  sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
  autoPrefix = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
  cache = require('gulp-cache'), // модуль для кэширования
  pug = require('gulp-pug');


/* задачи */

// запуск сервера
gulp.task('webServer', function () {
  webServer(config);
});

// сбор html
gulp.task('html:build', function () {
  gulp.src(path.src.html) // выбор всех html файлов по указанному пути
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
    .pipe(webServer.reload({stream: true})); // перезагрузка сервера
});

//сбор pug
gulp.task('pug:build', function () {
  gulp.src(path.src.pug)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(path.build.pug))
    .pipe(webServer.reload({stream: true}));
});

// сбор стилей
gulp.task('css:build', function () {
  gulp.src(path.src.style) // получим main.scss
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(sourcemaps.init()) // инициализируем sourcemap
    .pipe(sass()) // scss -> css
    .pipe(autoPrefix({ // добавим префиксы
      browsers: autoPrefixList
    }))
    .pipe(sourcemaps.write('./')) // записываем sourcemap
    .pipe(gulp.dest(path.build.css)) // выгружаем в build
    .pipe(webServer.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
  gulp.src(path.src.js) // получим файл main.js
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(rigger()) // импортируем все указанные файлы в main.js
    .pipe(sourcemaps.init()) //инициализируем sourcemap
    .pipe(sourcemaps.write('./')) //  записываем sourcemap
    .pipe(gulp.dest(path.build.js)) // положим готовый файл
    .pipe(webServer.reload({stream: true})); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});
gulp.task('webFonts:build', function () {
  gulp.src(path.src.webFonts)
    .pipe(gulp.dest(path.build.webFonts));
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


if (gulpVersion === 3) {
// сборка
  gulp.task('build', [
    'clean:build',
    'pug:build',
    'html:build',
    'css:build',
    'js:build',
    'fonts:build',
    'webFonts:build',
    'image:build'
  ]);

// запуск задач при изменении файлов
  gulp.task('watch', function () {
    gulp.watch(path.watch.pug, ['pug:build']);
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.css, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
    gulp.watch(path.watch.img, ['image:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
    gulp.watch(path.watch.webFonts, ['webFonts:build']);
  });

// задача по умолчанию
  gulp.task('default', [
    'clean:build',
    'build',
    'webServer',
    'watch'
  ]);
} else if (gulpVersion === 4) {
// сборка
  gulp.task('build', gulp.parallel(
    'clean:build',
    'pug:build',
    'html:build',
    'css:build',
    'js:build',
    'fonts:build',
    'webFonts:build',
    'image:build'
  ));

// запуск задач при изменении файлов
  gulp.task('watch', function () {
    gulp.watch(path.watch.pug, gulp.parallel('pug:build'));
    gulp.watch(path.watch.html, gulp.parallel('html:build'));
    gulp.watch(path.watch.css, gulp.parallel('css:build'));
    gulp.watch(path.watch.js, gulp.parallel('js:build'));
    gulp.watch(path.watch.img, gulp.parallel('image:build'));
    gulp.watch(path.watch.fonts, gulp.parallel('fonts:build'));
    gulp.watch(path.watch.webFonts, gulp.parallel('webFonts:build'));
  });

// задача по умолчанию
  gulp.task('default', gulp.parallel(
    'clean:build',
    'build',
    'webServer',
    'watch'
  ));
}