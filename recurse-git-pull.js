/**
 * Dependencies
 */

var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

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
    // if directory, call findGitDirs again on all files within the directory
    if (stats.isDirectory()) {
      var absPath = path.resolve(dirFile);
      if (path.basename(absPath) === '.git') {
        gitPull(absPath);
      }
      fs.readdir(dirFile, function(err, files) {
        if (err) throw err;
        for(var i = 0; i < files.length; i++) {
          findGitDirs(path.join(dirFile, files[i])); // recurse
        }
      });
    }
  });
}

function gitPull(gitPath) {
  var parentDir = path.dirname(gitPath);
  var gitRemote = spawnSync('git', ['--git-dir=' + gitPath, 'config', '--get', 'remote.origin.url']);
  if (gitRemote.status === 0) {
    var gitPull = spawnSync('git', ['--git-dir=' + gitPath, 'pull']);
    if (gitPull.error) throw gitPull.error;
    // handle errors
    if (gitPull.status !== 0) {
      console.log('Cannot update ' + parentDir);
      console.log('non-zero status: ' + gitPull.status);
    } else { 
      console.log('Updating ' + parentDir);
      console.log(gitPull.stdout.toString());
    }
  } else {
    console.log('Cannot update ' + parentDir);
    console.log('Nothing to update as there is not a remote origin');
    console.log();
  }
};

/**
 * Call function
 */

findGitDirs(startDir) ;
