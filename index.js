/**
 * Adapted from npm systemjs-transpile-cache for official plugin wrapping babel.
 *
 * Added support for resolving Dexie using module, and for returning sourceMap.
 */

/**
 * SystemJS translate hook that caches transpilation results of sources that haven't changed in IndexedDB storage.
 * In Chrome dev tools the cache is easily managed under Resources > IndexedDB > jspm
 * There's a global dependency on Dexie.js (ex: //npmcdn.com/dexie@1.3.3/dist/dexie.min.js)
 * Adapted from https://gist.github.com/ineentho/3ccaaec164e418f685d7
 */

/* global document */
/* global require */
/* global exports */

var originalTranslate = require('plugin-babel').translate;

(function () {
  if (typeof document !== 'undefined') {
    var Dexie = require('dexie')

    var db = new Dexie('jspm')
    db.version(1).stores({ files: '&url,format,hash,contents,sourceMap' })
    db.open()

    var log = console.log.bind(console)

    exports.translate = function (load) {
      var gotArguments = arguments
      if (!load.metadata.deps) {
        load.metadata.deps = []
      }

      function hash (str) {
        var hash = 0
        var i
        var chr
        var len
        if (str.length === 0) return hash
        for (i = 0, len = str.length; i < len; i++) {
          chr = str.charCodeAt(i)
          hash = ((hash << 5) - hash) + chr
          hash |= 0
        }
        return hash.toString()
      }

      var file = {url: load.address, hash: hash(load.source)}
      var loader = this

      return db.files.where('url').equals(file.url).first().then(function (cached) {
        if (!cached || cached.hash !== file.hash) {
          return originalTranslate.apply(loader, gotArguments).then(function (translated) {
            file.format = load.metadata.format
            file.contents = translated
            file.sourceMap = load.metadata.sourceMap

            return (cached ? db.files.delete(file.url) : Promise.resolve())
              .then(db.files.add(file))
              .then(function () {
                return translated
              }).catch(log)
          })
        } else {
          load.metadata.format = cached.format || undefined
          load.metadata.sourceMap = cached.sourceMap || undefined
          return cached.contents
        }
      }).catch(log)
    }
  } else {
    exports.translate = originalTranslate
  }
})()
