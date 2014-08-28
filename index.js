var blog = process.env.HOME + '/code/anichols/blog'
module.exports = function(grunt, name, publisher) {
  grunt.registerTask('publish', ['mochacov:html', 'npm:' + grunt.option('version'), 'git:origin', 'git:push', 'npm:publish', 'git:save', 'git:master', 'copy:all', 'git:commit', 'git:blog', 'git:heroku', 'git:previous', 'git:pop']);

  return {
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
      origin: {
        cmd: 'push origin master'
      },
      tags: {
        options: {
          tags: true
        }
      },
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

    npm: {
      patch: {
        options: {
          cmd: 'version patch'
        }
      },
      minor: {
        options: {
          cmd: 'version minor'
        }
      },
      major: {
        options: {
          cmd: 'version major'
        }
      },
      publish: {}
    },

    copy: {
      all: {
        files: [
          { expand: true, flatten: true, src: ['README.md'], dest: blog + '/pages/modules/' + publisher + '/', rename: function(dest, src) { return dest + name + '.md'; } }
          { expand: true, flatten: true, src: ['coverage/coverage.html'], dest: blog + '/pages/coverage/' + publisher + '/', rename: function(dest, src) { return dest + name + '.html'; } }
        ]
      }
    }
  };
};
