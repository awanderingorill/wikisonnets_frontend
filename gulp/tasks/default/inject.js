var gulp = require( 'gulp' );
var inject = require( 'gulp-inject' );

gulp.task('inject', function() {
	var target = gulp.src('./site/common-components/head/head.jade');

	target
		.pipe(inject(gulp.src('scripts/vendor.js', {read: false, cwd: "./build"}), {name: 'vendor', ignorePath: "build/"}))
		.pipe(inject(gulp.src('scripts/script.js', {read: false, cwd: "./build"}), {name: 'main'}))
		.pipe(inject(gulp.src('styles/jquery-ui.min.css', {read: false, cwd: "./build"}), {name: 'vendor'}))
		.pipe(inject(gulp.src('styles/main.css', {read: false, cwd: "./build"}), {name: 'main'}))
		.pipe(gulp.dest('./site/common-components/head/'));
});