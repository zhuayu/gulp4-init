const { src, dest, parallel, watch } = require('gulp');
const header  = require('gulp-header');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const less    = require('gulp-less');
const rename  = require('gulp-rename');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');

var banner = [
    '/*!',
    ' * <%= pkg.name %> v<%= pkg.version %>',
    ' * Copyright <%= new Date().getFullYear() %> Jaxzhu, Inc.',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''
].join('\n');

function script() {
  return src('src/js/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(dest('./dist/js'));
}

function style(){
  return src('src/less/*.less')
    .pipe(less())
    .pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]))
    .pipe(
      cssnano({
        zindex: false,
        autoprefixer: false,
        reduceIdents: false,
        discardComments: { removeAll: true }
      })
    )
    .pipe(
      rename(function(path) {
        path.extname = '.min.css';
      })
    )
    .pipe(header(banner, { pkg: pkg }))
    .pipe(dest('./dist/css'));
}

function images() {
  return  src('src/images/*')
    .pipe(dest('./dist/images'));
}

function watchAll() {
  return watch('src/**', parallel(script, style, images))
}

exports.script = script;
exports.style = style;
exports.images = images;
exports.default = watchAll;
