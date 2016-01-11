# walk-git-pull.js
Experiments with creating command line scripts with nodejs.  Recursively search through a directory and run `git pull` on all subdirectories that are under version control and have a remote origin. 

Can be used to update all repositories as part of general software updating.

## Usage
```
walk-git-pull.js /path/to/my/code/dir
```
