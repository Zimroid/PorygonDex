var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var minifyCSS = require('gulp-minify-css');
var replace = require('gulp-replace');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');

gulp.task('default', ['stylus', 'minHtmlProd', 'minJSFrontProd', 'bower-files'], function(){
  console.log("PorygonDex Ready :)");
});

//Transforme les fichier stylus en fichier css
gulp.task('stylus', function (){
  return gulp.src('./stylus/*.styl')
    .pipe(stylus())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css'));
});

//Stylus auto
gulp.task('watch', function(){
	gulp.watch('stylus/*.styl', ['stylus']).on('change', function(event){
		console.log('stylus ' + event.path + ' compiled');
	});
});

//Minify les fichiers js front et les place en prod
gulp.task('minJSFrontProd', function(){
	return gulp.src('./jsFront/*.js')
	    .pipe(uglify({mangle: false}))
	    .pipe(gulp.dest('./public/js'));
});


//Minifi les fichiers html et les envois en prod
gulp.task('minHtmlProd', function(){
	return gulp.src('./views/*.html')
		.pipe(replace(/<!--[^]*-->/g, ''))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./public/html'));
});

gulp.task('bower-files', function(){
    gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./public/angular'));
});