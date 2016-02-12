var gulp = require( 'gulp' );
var inject = require( 'gulp-inject' );

gulp.task('inject', function() {
	var target = gulp.src('./src/index.jade');

	target
		.pipe(inject(gulp.src('scripts/jquery.js', {read: false, cwd: "./dist"}), {name: 'vendor'}))
		.pipe(inject(gulp.src('scripts/angular-main.js', {read: false, cwd: "./dist"}), {name: 'main'}))
		.pipe(inject(gulp.src('styles/app_styles.css', {read: false, cwd: "./dist"}), {name: 'main'}))
		.pipe(gulp.dest('./src/'));
});