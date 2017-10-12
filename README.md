# caching-plugin-babel

This plugin delegates to plugin-babel for use in systemjs/jspm, for use in the transpilation pipeline of a browser.  Utilizing local IndexedDB (via dexie.js), the results of transpilation are cached using the hash of the source files.

This code was adapted from several examples to work with more recent releases of SystemJS, as well as adding source map support.  The original concept was published first here: https://gist.github.com/ineentho/3ccaaec164e418f685d7.   This was later adpated to a now-obselete npm package here: https://www.npmjs.com/package/systemjs-transpile-cache.  Neither of these will work with the latest versions of SystemJS.

## Using 

Rough steps:
 - jspm i npm:caching-plugin-babel
 - Change 'transpiler' in jspm.config.js, etc. to 'transpiler': 'caching-plugin-babel' 
 - enjoy unbundled JS module goodness on your favorite browser

Because this plugin adapts the SystemJS transpiler only, your application can continue to use bundles for vendor/components as needed.
