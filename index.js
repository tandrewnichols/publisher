#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var tasks = require('./tasks');

program
  .version(require('./package').version);
  .usage('<cmd> [options]')

program.name = 'publisher';

program
  .command('setup')
  .action(function(options) {
    var pkg = require(process.cwd() + '/package');
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.publish = "publisher run";
  });

program
  .command('run')
  .action(function(options) {
    tasks(); 
  });

program.parse(process.argv);
