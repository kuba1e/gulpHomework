const { src, dest, series, watch } = require("gulp");
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const del = require("del");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const sync = require("browser-sync").create();

function minJs(cb) {
  src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/lightslider/dist/js/lightslider.min.js",
    "src/js/*.js",
  ])
    .pipe(concat("all.min.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(sync.stream());
  cb();
}

function minCss(cb) {
  src([
    "src/css/*.css",
    "node_modules/lightslider/dist/css/lightslider.min.css",
  ])
    .pipe(concat("all.min.css"))
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(dest("dist/css"))
    .pipe(sync.stream());
  cb();
}

function minHtml(cb) {
  src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
  cb();
}

function putImages(cb) {
  src("src/img/*").pipe(dest("dist/img/"))
  cb();
}

function clearDist(cb) {
  del("dist/**");
  cb();
}

function clearImg(cb){
  del('dist/img/*')
  cb()
}

function browserSync() {
  sync.init({
    server: {
      baseDir: "./dist",
    },
    notify: false,
  });

  watch("src/css/**.css", minCss)
  watch(["src/js/*.js", "!node_modules/**"], minJs)
  watch('src/img/*',series(clearImg, putImages))
  watch("src/**.html", series(minHtml)).on("change", sync.reload);
}

exports.js = minJs;
exports.css = minCss;
exports.html = minHtml;
exports.img = putImages;
exports.clear = clearDist;
exports.clearImg = clearImg
exports.sync = browserSync;
exports.build = series(clearDist, minJs, minCss, putImages, minHtml);
exports.serve = series(clearDist, minJs, minCss, putImages, minHtml, browserSync)
