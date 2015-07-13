describe('Existence', function() {
  it('has yepnope', function() {
    expect(yepnope).not.toBeNull();
  });
});
//
// describe('Load Usage', function() {
//   it('loads in order', function(done) {
//     var count = 0;
//     var scripts = [
//       "http://code.jquery.com/jquery-1.11.2.min.js",
//       "http://localhost/cdn2/common/scripts/other/history/jquery.history.js",
//       "http://localhost/cdn2/common/scripts/other/handlebars/handlebars1.0.0.js",
//       "http://localhost/cdn2/csp/ldsorg/scripts/3play/3playBuilder.js",
//     ];
//     yepnope({
//       load: scripts,
//       callback: function() {
//         count++;
//       },
//       complete: function() {
//         expect(count).toBe(scripts.length);
//         var scriptCount = 0;
//         for (var i in document.getElementsByTagName('script')) {
//           var src = document.getElementsByTagName('script')[i].src;
//           if (src && src === scripts[scriptCount]) scriptCount++;
//         }
//         expect(scriptCount).toBe(scripts.length);
//         done();
//       }
//     });
//   });
// });
//
//
// describe('yep nope differences', function() {
//   it('loads correct script on true', function(done) {
//     yepnope({
//       test: true,
//       yep: "http://code.jquery.com/jquery-1.11.2.min.js",
//       nope: "http://code.jquery.com/jquery-1.11.0.min.js",
//       complete: function() {
//         expect($.fn.jquery).toBe('1.11.2');
//         done();
//       }
//     });
//   });
//
//   it('loads correct script on false', function(done) {
//     yepnope({
//       testResult: false,
//       yep: "http://code.jquery.com/jquery-1.11.2.min.js",
//       nope: "http://code.jquery.com/jquery-1.11.0.min.js",
//       complete: function() {
//         expect($.fn.jquery).toBe('1.11.0');
//         done();
//       }
//     });
//   });
// });
//
// describe('Multiple loads only one', function(done) {
//   it('should load only one instance of loadOnlyOnce', function(done) {
//     yepnope({
//       load: [
//         "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyOnce.js",
//         "https://dl.dropboxusercontent.com/u/41585993/Sharable%20Sites/Church/loadOnlyOnce.js"
//       ],
//       complete: function() {
//         expect(window.load).toBe(1);
//         done();
//       }
//     });
//   });
// });
