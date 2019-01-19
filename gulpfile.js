"use strict";

const gulpVersion = 4;

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
/* пути к исходным файлам (src), к готовым файлам (dist), а также к тем, за изменениями которых нужно наблюдать (watch) */
const path = {
  dist: {
    html: 'dist/',
    pug: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
    webFonts: 'dist/webfonts/'
  },
  src: {
    html: 'src/*.html',
    pug: 'src/pug/*.pug',
    js: 'src/js/**/*.js',
    style: 'src/scss/*.+(scss|sass)',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    webFonts: 'src/webfonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    pug: 'src/pug/**/*.pug',
    js: 'src/js/**/*.js',
    css: 'src/scss/**/*.+(scss|sass)',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    webFonts: 'src/webfonts/**/*.*'
  },
  clean: './dist'
};
/* настройки сервера */
const config = {
  server: {
    baseDir: './dist'
  },
  notify: false
};

/* подключаем gulp и плагины */
const gulp = require('gulp'),  // подключаем Gulp
  sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
  webServer = require('browser-sync'), // сервер для работы и автоматического обновления страниц
  //concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
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
gulp.task('html', function () {
  gulp.src(path.src.html) // выбор всех html файлов по указанному пути
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(gulp.dest(path.dist.html)) // выкладывание готовых файлов
    .pipe(webServer.reload({stream: true})); // перезагрузка сервера
});

//сбор pug
gulp.task('pug', function () {
  gulp.src(path.src.pug)
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(path.dist.pug))
    .pipe(webServer.reload({stream: true}));
});

// сбор стилей
gulp.task('css', function () {
  gulp.src(path.src.style) // получим main.scss
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(sourcemaps.init()) // инициализируем sourcemap
    .pipe(sass()) // scss -> css
    .pipe(autoPrefix({ // добавим префиксы
      browsers: autoPrefixList
    }))
    .pipe(sourcemaps.write('./')) // записываем sourcemap
    .pipe(gulp.dest(path.dist.css)) // выгружаем в dist
    .pipe(webServer.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js', function () {
  gulp.src(path.src.js) // получим файл main.js
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(rigger()) // импортируем все указанные файлы в main.js
    .pipe(sourcemaps.init()) //инициализируем sourcemap
    .pipe(uglify())
    .pipe(sourcemaps.write('./')) //  записываем sourcemap
    .pipe(gulp.dest(path.dist.js)) // положим готовый файл
    .pipe(webServer.reload({stream: true})); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});
gulp.task('webFonts', function () {
  gulp.src(path.src.webFonts)
    .pipe(gulp.dest(path.dist.webFonts));
});

// обработка картинок
gulp.task('image', function () {
  gulp.src(path.src.img) // путь с исходниками картинок
    .pipe(gulp.dest(path.dist.img)); // выгрузка готовых файлов
});

// удаление каталога dist
gulp.task('clean', function () {
  del.sync(path.clean);
  cache.clearAll();
});

// очистка кэша
gulp.task('cache:clear', function () {
  cache.clearAll();
});


if (gulpVersion === 3) {
// сборка
  gulp.task('dist', [
    'clean',
    'pug',
    'html',
    'css',
    'js',
    'fonts',
    'webFonts',
    'image'
  ]);

// запуск задач при изменении файлов
  gulp.task('watch', function () {
    gulp.watch(path.watch.pug, ['pug']);
    gulp.watch(path.watch.html, ['html']);
    gulp.watch(path.watch.css, ['css']);
    gulp.watch(path.watch.js, ['js']);
    gulp.watch(path.watch.img, ['image']);
    gulp.watch(path.watch.fonts, ['fonts']);
    gulp.watch(path.watch.webFonts, ['webFonts']);
  });

// задача по умолчанию
  gulp.task('default', [
    'clean',
    'dist',
    'webServer',
    'watch'
  ]);
} else if (gulpVersion === 4) {
// сборка
  gulp.task('dist', gulp.parallel(
    'clean',
    'pug',
    'html',
    'css',
    'js',
    'fonts',
    'webFonts',
    'image'
  ));

// запуск задач при изменении файлов
  gulp.task('watch', function () {
    gulp.watch(path.watch.pug, gulp.parallel('pug'));
    gulp.watch(path.watch.html, gulp.parallel('html'));
    gulp.watch(path.watch.css, gulp.parallel('css'));
    gulp.watch(path.watch.js, gulp.parallel('js'));
    gulp.watch(path.watch.img, gulp.parallel('image'));
    gulp.watch(path.watch.fonts, gulp.parallel('fonts'));
    gulp.watch(path.watch.webFonts, gulp.parallel('webFonts'));
  });

// задача по умолчанию
  gulp.task('default', gulp.parallel(
    'clean',
    'dist',
    'webServer',
    'watch'
  ));
}