const gulp = require('gulp')
const exec = require('gulp-exec')
const replace = require('gulp-replace')


gulp.task('directories', () => {
  return gulp.src('*.*', {read: false})
  .pipe(gulp.dest('./build'))
  .pipe(gulp.dest('./dist'))
})

gulp.task('toAbsImagePath', () => {
  return gulp.src('build/main.tex')
  .pipe(replace('./image', 'src/image'))
  .pipe(gulp.dest('build/'))
})

gulp.task('lint', () => {
  return gulp.src('src/*.md')
  .pipe(exec('npx textlint src/*.md'))
})

gulp.task('absMdToTex', () => {
  return gulp.src('src/abs.md')
  .pipe(exec('pandoc -F pandoc-crossref --listings src/abs.md -o build/abs.tex'))
})

gulp.task('mainMdToTex', () => {
  return gulp.src('src/main.md')
  .pipe(exec('pandoc -F pandoc-crossref --listings src/main.md -o build/main.tex'))
})

gulp.task('texToDvi', () => {
  return gulp.src('src/manuscript.tex')
  .pipe(exec('platex -halt-on-error -output-directory=build src/manuscript.tex'))
})

gulp.task('dviToPdf', () => {
  return gulp.src('build/manuscript.dvi')
  .pipe(exec('dvipdfmx build/manuscript.dvi -o dist/main.pdf'))
})

gulp.task('plantuml', () => {
  return gulp.src('src/uml/*.uml')
  .pipe(exec('plantuml src/uml/*.uml -o ../image/uml'))
})

gulp.task('deleteCaption', () => {
  return gulp.src('build/main.tex')
  .pipe(replace(/caption=.*,/g, ''))
  .pipe(gulp.dest('build/'))
})

const build = gulp.series(
  'directories',
  // 'lint',
  'absMdToTex',
  'mainMdToTex',
  'plantuml',
  'toAbsImagePath',
  'deleteCaption',
  'texToDvi',
  'texToDvi', // run twice
  'dviToPdf'
)

gulp.task('watch', () => {
  gulp.watch('src/*.md', build);
})

gulp.task('default', build)
