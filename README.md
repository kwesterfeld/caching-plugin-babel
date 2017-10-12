# caching-plugin-babel

This plugin delegates to plugin-babel for use in systemjs/jspm, for use in the transpilation pipeline of a browser.  Utilizing local IndexedDB (via dexie.js), the results of transpilation are cached using the hash of the source files.

This code was adapted from several examples to work with more recent releases of SystemJS, as well as adding source map support.

## Using 

Rough steps:
 - jspm i npm:caching-plugin-babel
 - Change 'transpiler': 'caching-plugin-babel' configuration 
 - enjoy unbundled JS module goodness on your favorite browser
