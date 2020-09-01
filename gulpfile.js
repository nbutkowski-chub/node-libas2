const fs = require('fs')
const gulp = require('gulp')
const shell = require('gulp-shell')

gulp.task('mkdir', async done => {
  if (!fs.existsSync('coverage')) {
    fs.mkdirSync('coverage')
  }

  return done()
})

gulp.task('clean:dist', shell.task(['del-cli ./dist']))

gulp.task('clean:index', shell.task(['del-cli ./index.js ./index.d.ts']))

gulp.task('clean', gulp.parallel('clean:dist', 'clean:index'))

gulp.task('compile', shell.task(['tsc']))

gulp.task(
  'compile:docs',
  shell.task([
    'jsdoc2md --no-cache --files ./src/**/*.ts --configure ./jsdoc2md.json > ./docs/API.md',
    'prettier-standard docs/API.md'
  ])
)

gulp.task(
  'compile:tests',
  shell.task([
    'mocha --reporter=markdown > ./docs/Tests.md',
    'prettier-standard docs/Tests.md'
  ])
)

gulp.task('docs', gulp.series('compile:docs', 'compile:tests'))

gulp.task('mocha', shell.task(['mocha']))

gulp.task('mocha:coverage', shell.task(['nyc mocha']))

gulp.task(
  'mocha:xunit',
  shell.task([
    'nyc mocha --reporter=xunit --reporter-options output=./coverage/mocha.xml'
  ])
)

gulp.task('eslint', shell.task(['prettier-standard --check --lint'], { ignoreErrors: true }))

gulp.task('eslint:fix', shell.task(['prettier-standard --lint'], { ignoreErrors: true }))

gulp.task(
  'eslint:xunit', // Broken
  shell.task(['eslint --format junit --ext .ts . > ./coverage/eslint.xml'], {
    ignoreErrors: true
  })
)

gulp.task(
  'codecov',
  shell.task(['codecov -t 7f3b18f1-5a06-49da-be74-b71410c39432'])
)

gulp.task(
  'test',
  gulp.series(/* gulp.series('mkdir', 'eslint:xunit'), */ 'mocha:xunit')
)

gulp.task('test:local', gulp.series('eslint', 'mocha:coverage'))
