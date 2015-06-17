/**
 * Dependencies
 */

var fs = require('fs');
var path = require('path');

/**
 * Options
 */

startDir = process.argv[2];

/**
 * Define functions
 */

// recursive search a la *nix find

function find(dirFile) {
  fs.stat(dirFile, function(err, stats) {
    if (err) throw err;
    // if directory, call find again on all files within the directory
    if (stats.isDirectory()) {
      var absPath = path.resolve(dirFile);
      if (path.basename(absPath) === '.git') {
        console.log(absPath); 
      }
      fs.readdir(dirFile, function(err, files) {
        if (err) throw err;
        for(var i = 0; i < files.length; i++) {
          find(path.join(dirFile, files[i])); // recurse
        }
      });
    }
    // else { ignore files }
    /*else if (stats.isFile()) {
      year = stats['mtime'].getFullYear();
      month = stats['mtime'].getMonth();

      console.log('file: ' + dirFile);
      console.log('year: ' + year); 
      console.log('month: ' + month);
      console.log();

      if (uniqueYears.indexOf(year) === -1) {
        uniqueYears.push(year);
      }
      if (uniqueMonths.indexOf(month) === -1) {
        uniqueMonths.push(month);
      }
    }*/
  });
}

find(startDir) ;
