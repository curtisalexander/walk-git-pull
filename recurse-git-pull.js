/**
 * Dependencies
 */

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
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
        var parentDir = path.dirname(absPath);
        var gitRemote = spawnSync('git', ['--git-dir=' + absPath, 'config', '--get', 'remote.origin.url']);
        console.log(absPath);
        console.log(parentDir);
        console.log('file: ' + gitRemote.file);
        console.log('args: ' + gitRemote.args);
        console.log('stdout: ' + gitRemote.stdout);
        console.log('stderr: ' + gitRemote.stderr);
        console.log('status: ' + gitRemote.status);
        console.log();
        // var gitRemote = exec('git --git-dir=' + absPath + ' config --get remote.origin.url', function(err, stdout, stderr));
        // listeners
        /*
        gitRemote.stdout.on('data', function(data) {
          console.log(absPath);
          console.log(parentDir);
          console.log('git remote url: ' + data);
        });
        gitRemote.stderr.on('data', function(data) {
          console.log('error: ' + data);
        }); 
        gitRemote.on('close', function (code) {
          console.log(absPath);
          console.log(parentDir);
          console.log('exited with code: ' + code);
          console.log();
        });*/
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

findGitDirs(startDir) ;
