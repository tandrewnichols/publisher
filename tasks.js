var grunt = require('grunt');
var root = process.env.HOME + '/code/anichols/';
var blog = root + 'blog';
var pathFromRoot = process.cwd().replace(root, '');
var parts = pathFromRoot.split('/');
var publisher = parts[0] === 'manta' ? 'mantacode' : 'tandrewnichols'
var repo = publisher === 'mantacode' ? parts[1] : parts[0];

module.exports = function() {
  // Can't use loadNpmTasks, because that will load them from
  // the target repo (cwd)
  require('grunt-simple-git/tasks/git')(grunt);
  require('grunt-contrib-copy/tasks/copy')(grunt);
  require('grunt-mocha-cov/tasks/mochacov')(grunt);
  require('./tasks/manifest')(grunt, blog, root, publisher, repo)

  grunt.initConfig({
    mochacov: {
      html: {
        options: {
          reporter: 'html-cov',
          ui: 'mocha-given',
          require: 'coffee-script/register',
          output: 'coverage/coverage.html'
        },
        src: ['test/**/*.coffee', '!test/acceptance.coffee']
      }
    },

    git: {
      options: {
        cwd: blog
      },
      pushorigin: {
        cmd: 'push origin master'
      },
      pushheroku: {
        cmd: 'push heroku master'
      },
      pullorigin: {
        cmd: 'pull origin master'
      },
      pullheroku: {
        cmd: 'pull heroku master'
      },
      add: {
        options: {
          all: true
        }
      },
      commit: {
        options: {
          message: 'Copied new documenation and coverage from ' + repo
        }
      },
      save: {
        cmd: 'stash save grunt-auto-stash' 
      },
      master: {
        cmd: 'checkout master'
      },
      previous: {
        cmd: 'checkout @{-1}'
      },
      apply: {
        options: {
          force: true,
          stdio: false
        },
        cmd: 'stash apply stash^{/grunt-auto-stash}'
      }
    },

    copy: {
      all: {
        files: [
          { expand: true, flatten: true, src: ['README.md'], dest: blog + '/modules/' + publisher + '/', rename: function(dest, src) { return dest + '/' + repo + '.md'; } },
          { expand: true, flatten: true, src: ['coverage/coverage.html'], dest: blog + '/coverage/' + publisher + '/', rename: function(dest, src) { return dest + '/' + repo + '.html'; } }
        ]
      }
    }
  });

  grunt.tasks(['mochacov:html', 'git:save', 'git:master', 'copy:all', 'manifest', 'git:add', 'git:commit', 'git:pullorigin', 'git:pushorigin', 'git:pullheroku', 'git:pushheroku', 'git:previous', 'git:apply'], { gruntfile: false }, function() {
    grunt.log.ok(repo + ' README.md and coverage.html copied to blog and deployed.');
  });
};
