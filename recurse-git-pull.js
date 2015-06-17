/**
 * Dependencies
 */

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

/**
 * Options
 */

startDir = process.argv[2];

/**
 * Define functions
 */

// recursive search a la *nix find

function findGitDirs(dirFile) {
  fs.stat(dirFile, function(err, stats) {
    if (err) throw err;
    // if directory, call find again on all files within the directory
    if (stats.isDirectory()) {
      var absPath = path.resolve(dirFile);
      if (path.basename(absPath) === '.git') {
        var parentDir = path.dirname(absPath);
        console.log(absPath);
        console.log(parentDir);
        console.log();
        var gitRemote = spawn('git', ['--git-dir=' + absPath, 'config', '--get', 'remote.origin.url']);
        gitRemote.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
        });
      }
      fs.readdir(dirFile, function(err, files) {
        if (err) throw err;
        for(var i = 0; i < files.length; i++) {
          findGitDirs(path.join(dirFile, files[i])); // recurse
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

findGitDirs(startDir) ;
