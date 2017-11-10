var gulp           = require('gulp');
var browserSync    = require('browser-sync');
var del            = require('del');
var changed        = require('gulp-changed');
var convertNewline = require('gulp-convert-newline');
var ejs            = require('gulp-ejs');
var imagemin       = require('gulp-imagemin');
var pleeease       = require('gulp-pleeease');
var plumber        = require('gulp-plumber');
var rename         = require('gulp-rename');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var uglify         = require('gulp-uglify');
var runSequence    = require('run-sequence');


// デフォルト：publicフォルダを削除してビルド
gulp.task('default', function (callback) {
  runSequence('clean', 'build', callback);
});

// 削除するタスク
gulp.task('clean', function () {
  del.sync([
    'public/'
  ], {
    dot: true
  }).map(function (path) {
    console.log('Deleted:', path);
  });
});

// ビルド
gulp.task('build', function (callback) {
  runSequence([
    'ejs',
    'sass-dev',
    'uglify',
    'imagemin',
    'copy'
  ], callback);
});

// リリース時に実行するタスク
gulp.task('release', function (callback) {
  runSequence([
    'clean',
    'ejs',
    'sass',
    'uglify',
    'imagemin',
    'copy'
  ], callback);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    notify: false,
    open: true,
    port: 3000,
    reloadOnRestart: true,
    server: {
      baseDir: ['public/']
    },
    ui: {
      port: 3001
    }
  });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

// 下記に並ぶタスク以外でそのまま出力したいもの
var copyTask = [
  'source/**/*.ico',
  'source/**/*.pdf',
  'source/**/*.ttf',
  'source/**/*.otf',
  'source/**/*.eot',
  'source/**/*.woff',
  'source/**/*.woff2',
];

gulp.task('copy', function() {
  return gulp.src(copyTask,{base: 'source/'})
  .pipe(plumber())
  .pipe(changed('public/'))
  .pipe(gulp.dest('public/'))
});

// ejsコンパイル
gulp.task('ejs', function() {
  gulp.src(['source/**/*.ejs','!' + 'source/**/_*.ejs'])
  .pipe(plumber())
  .pipe(ejs())
  .pipe(convertNewline({
    newline: 'crlf', // 改行コードをCRLFで出力
    encoding: 'utf8'
  }))
  .pipe(rename({extname: '.html'}))
  .pipe(gulp.dest('public/'))
});

// リリース用sass（watchしない）
gulp.task('sass', function() {
  return gulp.src('source/scss/**/*.scss')
  .pipe(plumber())
  .pipe(changed('public/'))
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(pleeease({
    minifier: false,
    autoprefixer: true,
    browsers: ['last 2 versions', 'ie >= 9','iOS >= 8', 'Android >= 4']
  }))
  .pipe(gulp.dest('public/css/'))
});

// 開発用sass（コード圧縮せず、ソースマップを生成する）
gulp.task('sass-dev', function() {
  return gulp.src('source/scss/**/*.scss')
  .pipe(plumber())
  .pipe(changed('public/css/'))
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(pleeease({
    minifier: false,
    autoprefixer: true,
    browsers: ['last 2 versions', 'ie >= 9', 'iOS >= 8', 'Android >= 4']
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/css/'))
});


// javascript圧縮
gulp.task('uglify', function() {
  return gulp.src('source/js/**/*.js')
  .pipe(plumber())
  .pipe(changed('public/js/'))
  .pipe(uglify())
  .pipe(gulp.dest('public/js/'))
});

// 画像圧縮
gulp.task('imagemin', function() {
  return gulp.src('source/images/**/*.+(jpg|jpeg|png|gif|svg)')
  .pipe(plumber())
  .pipe(changed('public/images/'))
  .pipe(imagemin())
  .pipe(gulp.dest('public/images/'))
});

// 監視用のタスク
gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(['source/**/*.ejs'], ['ejs']);
  gulp.watch(['source/**/*.scss'], ['sass-dev']);
  gulp.watch(['source/**/*.js'], ['uglify']);
  gulp.watch(['source/**/*.+(jpg|jpeg|png|gif|svg)'], ['imagemin']);
  gulp.watch(['public/**/*.html'], ['bs-reload']);
  gulp.watch(['public/**/*.css'], ['bs-reload']);
  gulp.watch(copyTask, ['copy']);
});
