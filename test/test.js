window.load = 0;
describe('yepnope tests', function() {

  var removeAllScriptsAndStyles = function() {
    var sub = function(type) {

      var elements = document.getElementsByTagName(type);
      for (var i in elements) {
        if (i.parentNode) i.parentNode.removeChild(i);
      }

    };

    sub('script');
    sub('style');

    return false;
  };

  beforeEach(function() {
    removeAllScriptsAndStyles();
  });


  describe('Existence', function() {
    it('has yepnope', function() {
      expect(yepnope).not.toBeNull();
    });
  });

  describe('yep nope differences', function() {
    it('loads correct script on true', function(done) {
      yepnope({
        test: true,
        yep: "http://code.jquery.com/jquery-1.11.2.min.js",
        nope: "http://code.jquery.com/jquery-1.11.0.min.js",
        complete: function() {
          expect($.fn.jquery).toBe('1.11.2');
          done();
        }
      });
    });

    it('loads correct script on false', function(done) {
      yepnope({
        testResult: false,
        yep: "http://code.jquery.com/jquery-1.11.2.min.js",
        nope: "http://code.jquery.com/jquery-1.11.0.min.js",
        complete: function() {
          expect($.fn.jquery).toBe('1.11.0');
          done();
        }
      });
    });
  });

  describe('Multiple loads only one', function(done) {
    it('should load only one instance of loadOnlyOnce', function(done) {
      yepnope({
        load: [
          "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyOnce.js",
          "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyOnce.js"
        ],
        complete: function() {
          expect(window.load).toBe(1);
          done();
        }
      });
    });

    it('should only load once, but run both completes', function(done) {
      var count = 0;
      var finished = function() {
        count++;
        if (count == 2) {
          done();
        }
      };
      var obj = {
        load: "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyTwice.js",
        complete: finished
      };
      yepnope([obj, obj]);
    });
  });

  describe('api weirdness', function(done) {
    it('should load complete in object at end of array', function(done) {
      yepnope([
        {
          test: false,
          nope: "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyOnce.js"
        },
        {
          test: true,
          yep: "http://code.jquery.com/jquery-1.10.0.min.js"
        },
        {
          test: true,
          nope: "http://code.jquery.com/jquery-1.11.0.min.js"
        },
        {
          complete: function() {
            expect(window.load).toBe(1);
            expect($.fn.jquery).toBe('1.10.0');
            done();
          }
        }
      ]);
    });
  });
});
