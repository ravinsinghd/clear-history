const { src, dest, parallel, series } = require('gulp');
const del = require('delete');
const webExt = require('web-ext').default;

const DIST = './dist';
const FireFox_DIST = './dist/firefox/';
const FIREFOX_SRC = './firefox';

function defaultTask() {}

function cleanDist(cb) {
  del([DIST], cb);
}

function copyIconsForFirefox() {
  return src('./icons/**').pipe(dest(FireFox_DIST + 'icons'));
}
function copyManifestForFirefox() {
  return src(FIREFOX_SRC + '/manifest.json').pipe(dest(FireFox_DIST));
}

function runFirefoxWebExtension() {
  webExt.cmd
    .run(
      {
        sourceDir: FireFox_DIST,
        verbose: true
      },
      { shouldExitProgram: false }
    )
    .catch(error => console.error('CAUGHT', JSON.stringify(error)));
}

exports.default = defaultTask;
exports.build = series(cleanDist, parallel(series(copyManifestForFirefox, copyIconsForFirefox)));
exports.runFirefox = series(copyManifestForFirefox, copyIconsForFirefox, runFirefoxWebExtension);
