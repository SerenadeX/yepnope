let isFunction = (func) => typeof func === 'function';
let isString = (string) => typeof string === 'string';
let isArray = Array.isArray || ((arr) =>  {}.toString() == '[object Array]');
let isObject = (obj) => Object(obj) === obj;

let yepnopeScripts = [];

class Yepnope {
  constructor(needs) {
    this.fileStack = 0;
    this.execStack = [];
    this.timeout = 1e4;
    this.cache = [];
    this.firstScript = document.getElementsByTagName('script')[0];
    this.complete = function() {};


    if (isString(needs)) this.loadFile(needs);
    if (isArray(needs)) this.loadFromArray(needs);
    if (isObject(needs)) this.loadFromObject(needs);
  }
  readFirstScript() {
    if (!this.firstScript || !this.firstScript.parentNode) {
      this.firstScript = document.getElementsByTagName('script')[0];
    }
  }
  isFileReady(readyState) {
    return (!readyState || readyState == "loaded" || readyState == "complete" || readyState == "uninitialized");
  }
  loadFromObject(obj) {
    let testResult = obj.test;
    let group = testResult ? obj.yep : obj.nope;
    let always = obj.load || obj.both;
    let callback = obj.callback || function() {};

    this.complete = obj.complete
    let cbRef = callback;

    let runOnGroup = (needGroup, moreToCome) => {

      if ('' !== needGroup && !needGroup && !moreToCome) {

        // complete();
      } else if (isString(needGroup)) {
        if (!moreToCome) {
          callback = () => {
            let args = [].slice.call(arguments);
            cbRef.apply(this, args);
            // complete();
          };
        }
        this.loadFile(needGroup, callback);
      } else if (isObject(needGroup)) {
        var needGroupSize = Object.keys(needGroup).length;

        for (let key in needGroup) {
          if (!moreToCome && !--needGroupSize) {
            if (!isFunction(callback)) {
              callback[callbackKey] = (innerCb) => {
                return () => {
                  let args = [].slice.call(arguments);
                  if (innerCb) innerCb.apply(this, args);
                  // complete();
                };
              };
            } else {
              callback = () => {
                var args = [].slice.call(arguments);
                cbRef.apply(this, args);
                // complete();
              };
            }
          }
          this.loadFile(needGroup[key], callback);
        }
      }

    };

    runOnGroup(group, always || this.complete);
    if (always) {
      runOnGroup(always);
    } else if (complete) {
      runOnGroup();
    }

  }
  loadFromArray(arr) {
    for (var key in arr) {
      var a = arr[key];
      if (isString(a)) this.loadFile(a);
      if (isArray(a)) this.loadFromArray(a);
      if (isObject(a)) this.loadFromObject(a);
    }
  }
  getExtension(url) {
    let b = url.split('?')[0];
    return b.substr(b.lastIndexOf('.')+1);
  }
  load(resource, ext = 'js') {
    this.started = false;

    this.fileStack++;
    if (isString(resource)) {
      this.preloadFile(resource, ext);
    } else {
      this.execStack.splice(this.fileStack, 0, resource);
      if (this.execStack.length === 1) this.executeStack();
    }
  }
  preloadFile(url, ext) {
    var elementType;
    var validType = false;
    var firstFlag = false;
    var done = false;

    var stackObject = {
      ext,
      url
    };

    if (ext === 'css') {
      validType = true;
      elementType = 'img';
    } else if (ext === 'js') {
      validType = true;
      elementType = 'img';
    } else {
      elementType = 'div';
    }


    var element = document.createElement(elementType);
    if (this.cache[url] === 1) {
      firstFlag = true;
      this.cache[url] = [];
    }

    let onload = (first) => {
      if (!done && this.isFileReady(element.readyState)) {
        done = true;
        if (!this.started) this.executeStack();

        if (first) {
          if (elementType === 'img') setTimeout(() => this.firstScript.parentNode.removeChild(element), 50);

          for (var i in this.cache[url]) {
            var item = this.cache[url][i];
            item.onload();
          }
          element.onload = element.onreadystatechange = null;
        }
      }
    };

    if (yepnopeScripts.indexOf(url) > -1) {
      return;
    }

    element.src = url;
    element.setAttribute('type', 'text/javascript');
    element.width = element.height = '0';

    this.execStack.splice(this.fileStack, 0, stackObject);

    element.onerror = element.onload = element.onreadystatechange = () => {
      onload.call(this, firstFlag);
    };

    if (elementType == 'img') {

      if (firstFlag || this.cache[url] === 2) {
        this.readFirstScript();
        this.firstScript.parentNode.insertBefore(element, this.firstScript);
        setTimeout(() => {
          onload();
        }, this.timeout);
      } else {
        this.cache[url].push(element);
      }
    }

  }
  executeStack() {
    var item = this.execStack.shift();
    this.started = true;


    if (item) {
      if (item.ext) { //not a function
        setTimeout(() => {
          this.injectFile(item);
        }, 1);
      } else {
        item();
        this.executeStack();
      }
    } else {
    
      this.started = false;
      if (!this.execStack.length && isFunction(this.complete)) {
        this.complete();
      }
    }

  }
  loadFile(filename, callback) {
    let extension = this.getExtension(filename);

    if (callback && !isFunction(callback)) {
      callback = callback[filename] || filename.split("/").pop().split('?')[0];
    }


    this.cache[filename] = 1;

    if (filename) {
      this.load(filename, extension);
    }

    if (isFunction(callback)) {
      this.load(() => {

        callback(filename);
        this.cache[filename] = 2;
      });
    }
  }
  injectFile(item) {
    var element;
    var done = false;

    if (item.ext === 'css') {
      element = document.createElement('link');
      element.setAttribute('rel', 'stylesheet');
      element.setAttribute('type', 'text/css');
      element.setAttribute('href', item.url);
    }

    if (item.ext === 'js') {
      element = document.createElement('script');
      element.setAttribute('type', 'text/javascript');
      element.src = item.url;
    }

    if (yepnopeScripts.indexOf(item.url) > -1) {
      this.executeStack();
      return;
    }

    yepnopeScripts.push(item.url);



    element.onload = () => {
      if (!done && this.isFileReady(element.readyState)) {
        done = true;
        this.executeStack();
        element.onload = element.onload = null;
      }
    };

    element.onreadystatechange = element.onload;


    setTimeout(() => {
      if (!done) {
        done = true;
        this.executeStack();
      }
    }, this.timeout);

    this.readFirstScript();

    this.firstScript.parentNode.insertBefore(element, this.firstScript);

  }
}

let yepnope = (needs) => {
  return new Yepnope(needs);
};
