# yepnope
A 'fork' of [yepnope](http://yepnopejs.com), continuing on what was discontinued.

Internally we were having some issues on what worked with yepnope 1.5.4.  There were times when it didn't load things in the right order or other things were timing out, breaking our page.  So I went through as a practice and rewrote yepnope in ES6. The source is here as well as a build of it in ES5 using [Babel](http://babeljs.io)

There is still some extended testing that needs to be done on this for cross browser support.


### yepnope(url)

Load the file into the DOM.  `url` should be a string of a URL to a javascript or css file.

### yepnope(urls)

Load the list of urls into the DOM in order.  `urls` is an array of URL strings.

### yepnope(opts)

Load files based on the options below.  `opts` is an object with the following values


#### Options

`test`: a Boolean to check.  If true, the `yep` value will be processed.  If false, the `nope` value will be processed.

`yep`: A url string, or array of url strings.  These will get loaded if `test` is true.

`nope`: A url string, or array of url strings.  These will get loaded if `test` is false.

`load`: A url string, or array of url strings.  These will always be loaded.

`callback`: A function that gets called after each file is loaded.

`complete`: A function that gets called when all files have been loaded.
