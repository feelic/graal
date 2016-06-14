module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ['<%= browserify.files %>'],
      tasks: ['build']
    },
    browserify: {
      dist: {
        files: {
          'dist/app.js': ['src/**/*.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('build', ['browserify']);

};
