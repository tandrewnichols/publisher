#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var tasks = require('./tasks');
var chalk = require('chalk');

program
  .version(require('./package').version)
  .usage('<cmd> [options]')

program.name = 'publisher';

program
  .command('setup')
  .description('Adds a publish script to package.json that executes publisher run')
  .action(function(options) {
    var pkg = require(process.cwd() + '/package');
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.publish = "if echo $USERNAME | grep -cq 'anichols'; then publisher run; fi";
    fs.writeFile(process.cwd() + '/package.json', JSON.stringify(pkg, null, 2), function() {
      console.log(chalk.green('Added "publish" script to package.json'));
    });
  });

program
  .command('run')
  .description('Executes a series of post publish tasks, including deploying the blog to heroku')
  .action(function(options) {
    tasks(); 
  });

program.parse(process.argv);
