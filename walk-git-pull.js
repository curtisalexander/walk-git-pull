#!/usr/bin/env node

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

function findGitDirs(dirOrFile) {
  fs.stat(dirOrFile, function(err, stats) {
    if (err) throw err;
    // if directory, call findGitDirs again on all files within the directory
    if (stats.isDirectory()) {
      var absPath = path.resolve(dirOrFile);
      if (path.basename(absPath) === '.git') {
        gitPull(absPath);
      }
      fs.readdir(dirOrFile, function(err, files) {
        if (err) throw err;
        for(var i = 0; i < files.length; i++) {
          findGitDirs(path.join(dirOrFile, files[i])); // recurse
        }
      });
    }
  });
}

// execute git pull on remote origins

function gitPull(gitDir) {
  var repoDir = path.dirname(gitDir);
  var gitRemote = spawnSync('git', ['--git-dir=' + gitDir, 'config', '--get', 'remote.origin.url']);
  
  if (gitRemote.status === 0) {
    var gitPullCommand = spawnSync('git', ['--git-dir=' + gitDir, '--work-tree=' + repoDir, 'pull']);
    if (gitPullCommand.error) throw gitPullCommand.error;
    // handle errors
    if (gitPullCommand.status !== 0) {
      console.log('Cannot update ' + repoDir);
      console.log('non-zero status: ' + gitPullCommand.status);
    } else { 
      console.log('Updating ' + repoDir);
      console.log(gitPullCommand.stdout.toString());
    }
  } else {
    console.log('Cannot update ' + repoDir);
    console.log('Nothing to update as there is not a remote origin');
    console.log();
  }
};

/**
 * Call function
 */

findGitDirs(startDir) ;
