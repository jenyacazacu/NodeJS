var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var minifyCSS = require('path');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var Ractive = require('ractive');
var tap = require('gulp-tap');

gulp.task('css', function() {
	gulp.src('./less/styles.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(gulp.des('/static/css'))
	.pipe(minifyCSS({keepBreaks:true}))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./static/css'));
});

gulp.task('js', function() {
	gulp.src('./js/app.js')
	.pipe(browserify())
	.pipe(gulp.dest('./static/js'))
	.pipe(uglify())
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest('./static/js'))
});

gulp.task('tempplates', function() {
	gulp.src('./tpl/**/*.html')
	.pipe(tap(function(file, t) {
		var precompiled = Ractive.parse(file.contents.toString());
		precompiled = JSON.stringify(precompiled);
		file.contents = new Buffer('module.exports = ' + precompiled);
	}))
	.pipe(rename(function(path) {
		path.extname = '.js';
	}))
	.pipe(gulp.dest('./tpl'))
});


gulp.tast('watchers', function() {
	gulp.watch('less/**/*.less', ['css']);
});

gulp.task('default', ['css', 'templates','js', 'watchers']);