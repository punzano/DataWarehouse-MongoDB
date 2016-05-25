var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    pxtorem = require('postcss-pxtorem'),
    uniqueSelectors = require('postcss-unique-selectors');

// HTML TASKS
gulp.task('cleanHTMLFiles', function() {
  return gulp.src('dist/front-end/*.html')
		.pipe(clean({force: true}));
});
gulp.task('moveHTMLFiles', ['cleanHTMLFiles'], function() {
  gulp.src('front-end/*.html')
    .pipe(gulp.dest('dist/front-end'));
});

//CSS AND SASS TASKS
gulp.task('cleanCSSFiles', function() {
  return gulp.src('dist/front-end/*.css')
		.pipe(clean({force: true}));
});
var SCSSprocessors = [
    autoprefixer({
        browsers: 'last 3 versions'
    }),
    pxtorem({
        replace: true,
        rootValue: 13
    }),
    uniqueSelectors({
    })
];
gulp.task('compileSASS', function() {
  gulp.src('front-end/sass/*.scss')
    .pipe(sass())
    .pipe(postcss(SCSSprocessors))
    .pipe(gulp.dest('dist/front-end'));
});

//IMAGES TASKS
gulp.task('cleanImagesFiles', function() {
  return gulp.src('dist/front-end/images/*')
		.pipe(clean({force: true}));
});
gulp.task('imagesOptimization', ['cleanImagesFiles'], function(cb) {
  gulp.src('front-end/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/front-end/images'));
});

//JAVASCRIPT TASKS
gulp.task('cleanScriptFiles', function() {
  return gulp.src(['dist/front-end/js/**/*.js', 'dist/back-end/**/*.js'])
		.pipe(clean({force: true}));
});
gulp.task('compileJS', ['cleanScriptFiles'], function() {
  gulp.src('front-end/js/**/*.js')
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest('temp/front-end/js'));

  return gulp.src('back-end/**/*.js')
	// .pipe(babel({
	// 	presets: ['es2015']
	// }))
	.pipe(gulp.dest('dist/back-end'));
});
gulp.task('browserifyJS', ['compileJS'], function() {
  return browserify({
    entries: 'temp/front-end/js/app.js',
    extensions: ['.js']
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(gulp.dest("dist/front-end"));

  // return browserify({
  //   entries: 'temp/back-end/app.js',
  //   extensions: ['.js']
  // })
  // .bundle()
  // .pipe(source('app.js'))
  // .pipe(buffer())
  // .pipe(gulp.dest("dist/back-end"));
});
gulp.task('compileJSToSingleScript', ['browserifyJS'], function(){
  return gulp.src('./temp')
    .pipe(clean({force: true}));
});


//WATCHERS
gulp.task('watch', function() {
  gulp.watch('front-end/*.html', ['moveHTMLFiles']).on('change', function(){
    console.log('Cambio realizado en ficheros HTML, se lanza la tarea moveHTMLFiles.')
  });
  gulp.watch('front-end/images/**/*.png', ['imagesOptimization']).on('change', function(){
    console.log('Cambio realizado en las imágenes, se lanza la tarea imagesOptimization.')
  });
  gulp.watch('front-end/sass/*.scss', ['compileSASS']).on('change', function(){
    console.log('Cambio realizado en ficheros SASS, se lanza la tarea compileSASS.')
  });
  gulp.watch(['front-end/js/app.js', 'back-end/app.js'], ['compileJSToSingleScript']).on('change', function(){
    console.log('Cambio realizado en ficheros JS, se lanza la tarea compileJS.')
  });
});

//GENERAL TASKS
gulp.task('default', ['moveHTMLFiles', 'compileSASS', 'imagesOptimization', 'compileJSToSingleScript', 'watch']);
