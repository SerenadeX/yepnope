window.file1 = true;
console.log("file1 loaded");

yepnope({
  load : 'file2.js',
  callback: function() {
    console.log('callback buddy');
  },
  complete: function() {
//   	// start();
  console.log('complete buddy');
  }
});
