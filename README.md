# gulp4-init

## DEMO
通过以下事例子，完成一个 JavaScript ES6 及 Less 的开发环境配置。

1. 全局安装 gulp

```bash
npm install gulp-cli -g
```

2. 创建项目文件夹并进入

```bash
cd ~/Desktop && mkdir gulp-init && cd gulp-init
```

3. 初始化 package ，输入命令后一路回车。

```bash
npm init 
```

4. 下载各种依赖包，其中包括

- gulp
- gulp-rename
- gulp-header

- 用于 ES6 转译

  - gulp-babel
  - @babel/core
  - @babel/polyfill
  - @babel/preset-env

- 用于 压缩

  - gulp-uglify

- 用于 Less 转译

  - gulp-less
  - gulp-postcss
  - gulp-cssnano
  - autoprefixer

```bash
npm install gulp gulp-rename gulp-header gulp-babel @babel/core @babel/polyfill @babel/preset-env  gulp-uglify gulp-postcss gulp-less gulp-cssnano autoprefixer --save-dev
```

Gulp 使用 ES6 转译更多内容，可以到 [babel](https://babel.docschina.org/) 官网查看

Gulp 处理 Less 之后，使用了 postcss 对其进行了其他优化，例如 cssnano 代码优化 及 autoprefixer 后缀添加。

5. 在根目录下创建 **.babelrc** 文件，并编辑

```bash
touch .babelrc
```

```json
{
  "presets": ["@babel/preset-env"]
}
```

6. 在根目录创建开发环境目录 src , 并在 src 文件夹中 创建 js / less / images 文件夹

```bash
mkdir src && cd src && mkdir js & mkdir less
```

7. 在 /src/js 文件夹中 创建 **index.js** 并编辑

```bash
touch index.js
```

```js
let test = () => console.log('ok');
test();
```

8. 在 /src/less 文件夹中 创建 **index.less** 并编辑

```bash
touch index.less
```

```css
.xxx-section{
  color: #333;
  .xxx-list{
    transform: translate(-50%);
  }
}
```

9. 在 /src/images 文件夹中添加任意一张图片 例如 **avatar.png**

10. 在根目录创建 gulpfile.js , Gulp 运行主文件。

```bash
touch gulpfile.js
```

```js
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
```

11. bash 进入项目更目录中运行 gulp , 观察生成 dist 文件夹的各个文件。

```bash
gulp
```
