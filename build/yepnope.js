'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var isFunction = function isFunction(func) {
  return typeof func === 'function';
};
var isString = function isString(string) {
  return typeof string === 'string';
};
var isArray = Array.isArray || (function (arr) {}).toString() == '[object Array]';
var isObject = function isObject(obj) {
  return Object(obj) === obj;
};

var yepnopeScripts = [];

var Yepnope = (function () {
  function Yepnope(needs) {
    _classCallCheck(this, Yepnope);

    this.fileStack = 0;
    this.execStack = [];
    this.timeout = 10000;
    this.cache = [];
    this.firstScript = document.getElementsByTagName('script')[0];
    this.complete = function () {};

    if (isString(needs)) this.loadFile(needs);
    if (isArray(needs)) this.loadFromArray(needs);
    if (isObject(needs)) this.loadFromObject(needs);
  }

  _createClass(Yepnope, [{
    key: 'readFirstScript',
    value: function readFirstScript() {
      if (!this.firstScript || !this.firstScript.parentNode) {
        this.firstScript = document.getElementsByTagName('script')[0];
      }
    }
  }, {
    key: 'isFileReady',
    value: function isFileReady(readyState) {
      return !readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized';
    }
  }, {
    key: 'loadFromObject',
    value: function loadFromObject(obj) {
      var _this = this;

      var _arguments = arguments;

      var testResult = obj.test;
      var group = testResult ? obj.yep : obj.nope;
      var always = obj.load || obj.both;
      var callback = obj.callback || function () {};

      this.complete = obj.complete;
      var cbRef = callback;

      var runOnGroup = function runOnGroup(needGroup, moreToCome) {

        if ('' !== needGroup && !needGroup && !moreToCome) {} else if (isString(needGroup)) {
          if (!moreToCome) {
            callback = function () {
              var args = [].slice.call(_arguments);
              cbRef.apply(_this, args);
              // complete();
            };
          }
          _this.loadFile(needGroup, callback);
        } else if (isObject(needGroup)) {
          var needGroupSize = Object.keys(needGroup).length;

          for (var key in needGroup) {
            if (!moreToCome && ! --needGroupSize) {
              if (!isFunction(callback)) {
                callback[callbackKey] = function (innerCb) {
                  return function () {
                    var args = [].slice.call(_arguments);
                    if (innerCb) innerCb.apply(_this, args);
                    // complete();
                  };
                };
              } else {
                callback = function () {
                  var args = [].slice.call(_arguments);
                  cbRef.apply(_this, args);
                  // complete();
                };
              }
            }
            _this.loadFile(needGroup[key], callback);
          }
        }
      };

      runOnGroup(group, always || this.complete);
      if (always) {
        runOnGroup(always);
      } else if (this.complete) {
        runOnGroup();
      }
    }
  }, {
    key: 'loadFromArray',
    value: function loadFromArray(arr) {
      for (var key in arr) {
        var a = arr[key];
        if (isString(a)) this.loadFile(a);
        if (isArray(a)) this.loadFromArray(a);
        if (isObject(a)) this.loadFromObject(a);
      }
    }
  }, {
    key: 'getExtension',
    value: function getExtension(url) {
      var b = url.split('?')[0];
      return b.substr(b.lastIndexOf('.') + 1);
    }
  }, {
    key: 'load',
    value: function load(resource) {
      var ext = arguments[1] === undefined ? 'js' : arguments[1];

      this.started = false;

      this.fileStack++;
      if (isString(resource)) {
        this.preloadFile(resource, ext);
      } else {
        this.execStack.splice(this.fileStack, 0, resource);
        if (this.execStack.length === 1) this.executeStack();
      }
    }
  }, {
    key: 'preloadFile',
    value: function preloadFile(url, ext) {
      var _this2 = this;

      var elementType;
      var validType = false;
      var firstFlag = false;
      var done = false;

      var stackObject = {
        ext: ext,
        url: url
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

      var onload = function onload(first) {
        if (!done && _this2.isFileReady(element.readyState)) {
          done = true;
          if (!_this2.started) _this2.executeStack();

          if (first) {
            if (elementType === 'img') setTimeout(function () {
              return _this2.firstScript.parentNode.removeChild(element);
            }, 50);

            for (var i in _this2.cache[url]) {
              var item = _this2.cache[url][i];
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

      element.onerror = element.onload = element.onreadystatechange = function () {
        onload.call(_this2, firstFlag);
      };

      if (elementType == 'img') {

        if (firstFlag || this.cache[url] === 2) {
          this.readFirstScript();
          this.firstScript.parentNode.insertBefore(element, this.firstScript);
          setTimeout(function () {
            onload();
          }, this.timeout);
        } else {
          this.cache[url].push(element);
        }
      }
    }
  }, {
    key: 'executeStack',
    value: function executeStack() {
      var _this3 = this;

      var item = this.execStack.shift();
      this.started = true;

      if (item) {
        if (item.ext) {
          //not a function
          setTimeout(function () {
            _this3.injectFile(item);
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
  }, {
    key: 'loadFile',
    value: function loadFile(filename, callback) {
      var _this4 = this;

      var extension = this.getExtension(filename);

      if (callback && !isFunction(callback)) {
        callback = callback[filename] || filename.split('/').pop().split('?')[0];
      }

      this.cache[filename] = 1;

      if (filename) {
        this.load(filename, extension);
      }

      if (isFunction(callback)) {
        this.load(function () {

          callback(filename);
          _this4.cache[filename] = 2;
        });
      }
    }
  }, {
    key: 'injectFile',
    value: function injectFile(item) {
      var _this5 = this;

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

      element.onload = function () {
        if (!done && _this5.isFileReady(element.readyState)) {
          done = true;
          _this5.executeStack();
          element.onload = element.onload = null;
        }
      };

      element.onreadystatechange = element.onload;

      setTimeout(function () {
        if (!done) {
          done = true;
          _this5.executeStack();
        }
      }, this.timeout);

      this.readFirstScript();

      this.firstScript.parentNode.insertBefore(element, this.firstScript);
    }
  }]);

  return Yepnope;
})();

var yepnope = function yepnope(needs) {
  return new Yepnope(needs);
};

// complete();