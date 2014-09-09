var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');

module.exports = function(grunt, blog, root, publisher, repo) {
  grunt.registerTask('manifest', 'Update publish manifest with name, description, and version', function() {
    var done = this.async();
    var repoPath = root + '/' + (publisher === 'mantacode' ? 'manta/' + repo : repo);
    var pkg = require(repoPath + '/package');
    var manifest;

    try {
      manifest = require(blog + '/modules.json');
    } catch (e) {
      manifest = {};
    }

    if (!manifest[publisher]) {
      manifest[publisher] = [];
    }

    var current = _.findWhere(manifest[publisher], { name: pkg.name });
    if (!current) {
      current = {
        name: pkg.name,
        description: pkg.description,
        version: 'v' + pkg.version
      };
      manifest[publisher].push(current);
    } else {
      current.version = 'v' + pkg.version;
    }

    manifest[publisher] = _.sortBy(manifest[publisher], 'name');
    fs.readFile(repoPath + '/coverage/coverage.html', function(err, coverage) {
      var $ = cheerio.load(coverage);
      current.coverage = $('#coverage > #stats .percentage').text();
      fs.writeFile(blog + '/modules.json', JSON.stringify(manifest, null, 2), function(err) {
        if (err) {
          grunt.fail.fatal(err);
        } else {
          grunt.log.writeln('Manifest updated');
          grunt.log.writeln(JSON.stringify(current, null, 2));
          done();
        }
      });
    });
  });
};
