var grunt = require('grunt');
var root = process.env.HOME + '/code/anichols/';
var blog = root + 'blog';
var pathFromRoot = process.cwd().replace(root, '');
var parts = pathFromRoot.split('/');
var publisher = parts[0] === 'manta' ? 'mantacode' : 'tandrewnichols'
var repo = publisher === 'mantacode' ? parts[1] : parts[0];

module.exports = function() {
  grunt.loadNpmTasks('grunt-simple-git');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-cov');

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
      blog: {
        options: {
          cwd: blog
        },
        cmd: 'push origin master'
      },
      heroku: {
        options: {
          cwd: blog
        },
        cmd: 'push heroku master'
      },
      commit: {
        options: {
          a: true,
          message: 'Copied new documenation and coverage from ' + name,
          cwd: blog
        }
      },
      save: {
        options: {
          cwd: blog
        },
        cmd: 'stash save grunt-auto-stash' 
      },
      master: {
        options: {
          cwd: blog
        },
        cmd: 'checkout master'
      },
      previous; {
        options: {
          cwd: blog
        },
        cmd: 'checkout @{-1}'
      },
      apply: {
        options: {
          cwd: blog
        },
        cmd: 'stash apply stash^{/grunt-auto-stash}'
      }
    },

    copy: {
      all: {
        files: [
          { expand: true, flatten: true, src: ['README.md'], dest: blog + '/pages/modules/' + publisher + '/', rename: function(dest, src) { return dest + name + '.md'; } }
          { expand: true, flatten: true, src: ['coverage/coverage.html'], dest: blog + '/pages/coverage/' + publisher + '/', rename: function(dest, src) { return dest + name + '.html'; } }
        ]
      }
    }
  });

  grunt.tasks(['mochacov:html', 'git:origin', 'git:push', 'npm:publish', 'git:save', 'git:master', 'copy:all', 'git:commit', 'git:blog', 'git:heroku', 'git:previous'], { gruntfile: false }, function() {
    grunt.tasks(['git:apply'], { force: true }, function() {
      grunt.log.ok(repo + ' README and coverage.html copied to blog/pages/modules/' + publisher + ' and deployed.');
    });
  });
};
