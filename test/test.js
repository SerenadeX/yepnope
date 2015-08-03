describe('Existence', function() {
  it('has yepnope', function() {
    expect(yepnope).not.toBeNull();
  });
});
//
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
});

describe('api weirdness', function(done) {
  it('should load complete in object at end of array', function(done) {
    yepnope([
      {
        test: false,
        nope: "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyOnce.js"
      },
      {
        complete: function() {
          done();
        }
      }
    ]);
  });
});
