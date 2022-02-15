const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const cleanCss = require('gulp-clean-css')
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
import imagemin from "gulp-imagemin"
const sync = require('browser-sync').create();


function minJs(cb){
  src(['src/js/*.js','node_modules/jquery/dist/jquery.min.js'])
  .pipe(concat('all.min.js'))
  .pipe(uglify())
  .pipe(dest('dist/js'))
  cb()
}

function minCss(cb){
  src('src/css/*.css')
  .pipe(concat('all.min.css'))
  .pipe(cleanCss({compatibility: 'ie8'}))
  .pipe(dest('dist/css'))
  .pipe(sync.stream())
  cb()
}

function minHtml(cb){
  src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
  cb()
}

function minImg(cb){
  src('src/img/*')
  .pipe(imagemin())
  .pipe(dest('dist/img'))
  cb()
}

function browserSync(cb) {
  sync.init({
      server: {
          baseDir: "./",
          port:3000,
          notify: false
      }
  });

  watch('src/css/**.css', minCss);
  watch(['src/js/*.js', '!node_modules/**'], minJs);
  watch('src/**.html').on('change', sync.reload);
}


exports.js = minJs
exports.css = minCss
exports.html = minHtml
exports.img = minImg
exports.sync = browserSync