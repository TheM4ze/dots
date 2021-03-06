(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  module.exports = function(repo) {
    var stagedFiles, unstagedFiles;
    unstagedFiles = git.unstagedFiles(repo, {
      showUntracked: true
    });
    stagedFiles = git.stagedFiles(repo);
    return Promise.all([unstagedFiles, stagedFiles]).then(function(data) {
      return new SelectStageFiles(repo, data[0].concat(data[1]));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxrQ0FBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0I7TUFBQSxhQUFBLEVBQWUsSUFBZjtLQUF4QjtJQUNoQixXQUFBLEdBQWMsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEI7V0FDZCxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsYUFBRCxFQUFnQixXQUFoQixDQUFaLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQVUsSUFBSSxnQkFBSixDQUFxQixJQUFyQixFQUEyQixJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBUixDQUFlLElBQUssQ0FBQSxDQUFBLENBQXBCLENBQTNCO0lBQVYsQ0FETjtFQUhlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuU2VsZWN0U3RhZ2VGaWxlcyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3NlbGVjdC1zdGFnZS1maWxlcy12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICB1bnN0YWdlZEZpbGVzID0gZ2l0LnVuc3RhZ2VkRmlsZXMocmVwbywgc2hvd1VudHJhY2tlZDogdHJ1ZSlcbiAgc3RhZ2VkRmlsZXMgPSBnaXQuc3RhZ2VkRmlsZXMocmVwbylcbiAgUHJvbWlzZS5hbGwoW3Vuc3RhZ2VkRmlsZXMsIHN0YWdlZEZpbGVzXSlcbiAgLnRoZW4gKGRhdGEpIC0+IG5ldyBTZWxlY3RTdGFnZUZpbGVzKHJlcG8sIGRhdGFbMF0uY29uY2F0KGRhdGFbMV0pKVxuIl19
