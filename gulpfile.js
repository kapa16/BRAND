"use strict";

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
    js: 'dist/js/',
    json: 'dist/json/',
    css: 'dist/css/',
    img: 'dist/img/',
    fonts: 'dist/fonts/',
    webFonts: 'dist/webfonts/'
  },
  src: {
    html: 'src/*.html',
    js: 'src/js/main.js',//**/*.js',
    json: 'src/json/*.json',
    style: 'src/scss/*.+(scss|sass)',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    webFonts: 'src/webfonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    json: 'src/json/*.json',
    css: 'src/scss/**/*.+(scss|sass)',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    webFonts: 'src/webfonts/**/*.*'
  },
  clean: ['./dist', '!dist']
};
/* настройки сервера */
const config = {
  server: {
    baseDir: 'dist'
  },
  browser: 'chrome'
  //notify: false
};

/* подключаем gulp и плагины */
const gulp = require('gulp'),  // подключаем Gulp
  htmlMin = require('gulp-htmlmin'), //минификация html
  sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
  cssMin = require('gulp-csso'), // Подключаем пакет для минификации CSS
  webServer = require('browser-sync'), // сервер для работы и автоматического обновления страниц
  minifyJs = require('gulp-terser'), // Подключаем gulp-terser (для сжатия JS)
  del = require('del'), // плагин для удаления файлов и каталогов
  imageMin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
  rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
  sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
  autoPrefix = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
  cache = require('gulp-cache'), // модуль для кэширования
  rename = require('gulp-rename'), // Переименование файлов
  babel = require('gulp-babel');

/* задачи */

// запуск сервера
gulp.task('webServer', () => {
  return webServer(config);
});

// сбор html
gulp.task('html', () => {
  return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
  //.pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(path.dist.html)) // выкладывание готовых файлов
    .pipe(webServer.reload({stream: true})); // перезагрузка сервера
});

// сбор стилей
gulp.task('css', () => {
  return gulp.src(path.src.style) // получим main.scss
    .pipe(plumber()) // для отслеживания ошибок
    .pipe(sourcemaps.init()) // инициализируем sourcemap
    .pipe(sass()) // scss -> css
    .pipe(autoPrefix({ // добавим префиксы
      browsers: autoPrefixList
    }))
    .pipe(cssMin())
    .pipe(sourcemaps.write('./')) // записываем sourcemap
    .pipe(gulp.dest(path.dist.css)) // выгружаем в dist
    .pipe(webServer.reload({stream: true})); // перезагрузим сервер
});

// сбор js
gulp.task('js', () => {
  return gulp.src(path.src.js) // получим файл main.js
  //.pipe(plumber()) // для отслеживания ошибок
    .pipe(rigger()) // импортируем все указанные файлы в main.js
    .pipe(sourcemaps.init()) //инициализируем sourcemap
    .pipe(minifyJs()) //минификация
    .pipe(sourcemaps.write('./')) //  записываем sourcemap
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(path.dist.js)) // положим готовый файл
    .pipe(webServer.reload({stream: true})); // перезагрузим сервер
});

// babel
gulp.task('js:babel', () => {
  return gulp.src(path.src.js) // получим файл main.js
  //.pipe(plumber()) // для отслеживания ошибок
    .pipe(sourcemaps.init()) //инициализируем sourcemap
    .pipe(rigger()) // импортируем все указанные файлы в main.js
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(minifyJs()) //минификация
    .pipe(rename({
      suffix: '.es5'
    }))
    .pipe(sourcemaps.write('./')) //  записываем sourcemap
    .pipe(gulp.dest(path.dist.js)); // положим готовый файл
});

//библиотеки
gulp.task('libs', () => {
  return gulp.src(['src/libs/jquery/dist/jquery.min.js', 'src/libs/jquery-ui/jquery-ui.min.js'])
    .pipe(gulp.dest(path.dist.js));
});

//json
gulp.task('json', () => {
  return gulp.src(path.src.json)
    .pipe(gulp.dest(path.dist.json));
});

// перенос шрифтов
gulp.task('fonts', async () => {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});
gulp.task('webFonts', async () => {
  gulp.src(path.src.webFonts)
    .pipe(gulp.dest(path.dist.webFonts));
});

// обработка картинок
gulp.task('image', async () => {
  gulp.src(path.src.img) // путь с исходниками картинок
    .pipe(imageMin())
    .pipe(gulp.dest(path.dist.img)); // выгрузка готовых файлов
});

// удаление каталога dist
gulp.task('clean', () => {
  return del(path.clean);
});

// очистка кэша
gulp.task('cache:clear', () => {
  return cache.clearAll();
});


// сборка
gulp.task('dist', gulp.parallel(
  'html',
  'css',
  'js',
  'js:babel',
  'libs',
  'json',
  'fonts',
  'webFonts',
  'image'
));

//watch
gulp.task('html:watch', () => {
  return gulp.watch(path.watch.html, gulp.series('html'));
});
gulp.task('css:watch', () => {
  return gulp.watch(path.watch.css, gulp.series('css'));
});
gulp.task('js:watch', () => {
  return gulp.watch(path.watch.js, gulp.parallel('js', 'js:babel'));
});
gulp.task('json:watch', () => {
  return gulp.watch(path.watch.json, gulp.series('json'));
});
gulp.task('image:watch', () => {
  return gulp.watch(path.watch.img, gulp.series('image'));
});
gulp.task('fonts:watch', () => {
  return gulp.watch(path.watch.fonts, gulp.series('fonts'));
});
gulp.task('webFonts:watch', () => {
  return gulp.watch(path.watch.webFonts, gulp.series('webFonts'));
});

gulp.task('watch', gulp.parallel(
  'html:watch',
  'css:watch',
  'js:watch',
  'json:watch',
  'image:watch',
  'fonts:watch',
  'webFonts:watch'
));


// задача по умолчанию
gulp.task('default',
  gulp.series('clean', 'dist',
    gulp.parallel('webServer', 'watch')
  )
);
