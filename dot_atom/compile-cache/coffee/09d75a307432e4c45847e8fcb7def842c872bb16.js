(function() {
  var main, notificationHandler;

  main = require('./main');

  notificationHandler = null;

  module.exports = {
    getOutdated: function() {
      var args;
      args = ['outdated', '--json', '--no-color'];
      return this.runCommand(args, (function(_this) {
        return function(outdatedPkgsJSON) {
          var updatables;
          updatables = _this.parseAPMOutputJSON(outdatedPkgsJSON);
          if (updatables != null) {
            return _this.setPendingUpdates(updatables);
          }
        };
      })(this));
    },
    parseAPMOutputJSON: function(apmOutputJSON) {
      var availableUpdate, availableUpdates, error, i, len, results;
      try {
        availableUpdates = JSON.parse(apmOutputJSON);
      } catch (error1) {
        error = error1;
        main.verboseMsg("Error parsing APM output.\n " + apmOutputJSON);
        return;
      }
      results = [];
      for (i = 0, len = availableUpdates.length; i < len; i++) {
        availableUpdate = availableUpdates[i];
        results.push({
          'name': availableUpdate.name,
          'installedVersion': availableUpdate.version,
          'latestVersion': availableUpdate.latestVersion
        });
      }
      return results;
    },
    setPendingUpdates: function(pendingUpdates) {
      if ((pendingUpdates != null) && (pendingUpdates.length > 0)) {
        main.verboseMsg(pendingUpdates.length + " update" + (pendingUpdates.length > 1 ? 's' : '') + " found");
        if (main.userChosen.notifyMe) {
          this.summonNotifier(pendingUpdates);
        }
        if (main.userChosen.autoUpdate) {
          return this.processPendingUpdates(pendingUpdates);
        }
      } else {
        return main.verboseMsg("No update(s) found");
      }
    },
    summonNotifier: function(pendingUpdates) {
      var actionRequired, confirmMsg, saySomething, updatables;
      main.verboseMsg('Posting notification');
      if (notificationHandler == null) {
        notificationHandler = require('./notification-handler');
      }
      return notificationHandler.announceUpdates(updatables = pendingUpdates, saySomething = main.userChosen.autoUpdate || main.userChosen.confirmAction, actionRequired = main.userChosen.confirmAction, confirmMsg = main.userChosen.confirmAction ? notificationHandler.generateConfirmMsg(pendingUpdates) : null);
    },
    processPendingUpdates: function(pendingUpdates) {
      var args, i, len, pendingUpdate, results;
      results = [];
      for (i = 0, len = pendingUpdates.length; i < len; i++) {
        pendingUpdate = pendingUpdates[i];
        args = ['install', '--no-color', pendingUpdate.name + "@" + pendingUpdate.latestVersion];
        results.push(this.runCommand(args, function(apmInstallMsg) {
          if (notificationHandler == null) {
            notificationHandler = require('./notification-handler');
          }
          return notificationHandler.announceUpgradeOutcome(apmInstallMsg);
        }));
      }
      return results;
    },
    runCommand: function(args, callback) {
      var BufferedProcess, command, exit, outputs, stdout;
      command = atom.packages.getApmPath();
      outputs = [];
      stdout = function(output) {
        return outputs.push(output);
      };
      exit = function() {
        return callback(outputs);
      };
      BufferedProcess = require('atom').BufferedProcess;
      return new BufferedProcess({
        command: command,
        args: args,
        stdout: stdout,
        exit: exit
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL2F1dG91cGRhdGUtcGFja2FnZXMvbGliL3VwZGF0ZS1oYW5kbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztFQUNQLG1CQUFBLEdBQXNCOztFQUd0QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsV0FBQSxFQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLFFBQWIsRUFBdUIsWUFBdkI7YUFDUCxJQUFDLENBQUEsVUFBRCxDQUFZLElBQVosRUFBa0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLGdCQUFEO0FBQ2hCLGNBQUE7VUFBQSxVQUFBLEdBQWEsS0FBQyxDQUFBLGtCQUFELENBQW9CLGdCQUFwQjtVQUNiLElBQWtDLGtCQUFsQzttQkFBQSxLQUFDLENBQUEsaUJBQUQsQ0FBbUIsVUFBbkIsRUFBQTs7UUFGZ0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxCO0lBRlcsQ0FBYjtJQU9BLGtCQUFBLEVBQW9CLFNBQUMsYUFBRDtBQUNsQixVQUFBO0FBQUE7UUFDRSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBTCxDQUFXLGFBQVgsRUFEckI7T0FBQSxjQUFBO1FBRU07UUFDSixJQUFJLENBQUMsVUFBTCxDQUFnQiw4QkFBQSxHQUErQixhQUEvQztBQUNBLGVBSkY7O0FBS0E7V0FBQSxrREFBQTs7cUJBQ0U7VUFBQSxNQUFBLEVBQVEsZUFBZSxDQUFDLElBQXhCO1VBQ0Esa0JBQUEsRUFBb0IsZUFBZSxDQUFDLE9BRHBDO1VBRUEsZUFBQSxFQUFpQixlQUFlLENBQUMsYUFGakM7O0FBREY7O0lBTmtCLENBUHBCO0lBbUJBLGlCQUFBLEVBQW1CLFNBQUMsY0FBRDtNQUNqQixJQUFHLHdCQUFBLElBQW9CLENBQUMsY0FBYyxDQUFDLE1BQWYsR0FBd0IsQ0FBekIsQ0FBdkI7UUFDRSxJQUFJLENBQUMsVUFBTCxDQUFtQixjQUFjLENBQUMsTUFBaEIsR0FBdUIsU0FBdkIsR0FDRyxDQUFJLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQTNCLEdBQWtDLEdBQWxDLEdBQTJDLEVBQTVDLENBREgsR0FDa0QsUUFEcEU7UUFHQSxJQUFtQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQW5EO1VBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsY0FBaEIsRUFBQTs7UUFDQSxJQUEwQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQTFEO2lCQUFBLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixjQUF2QixFQUFBO1NBTEY7T0FBQSxNQUFBO2VBT0UsSUFBSSxDQUFDLFVBQUwsQ0FBZ0Isb0JBQWhCLEVBUEY7O0lBRGlCLENBbkJuQjtJQWdDQSxjQUFBLEVBQWdCLFNBQUMsY0FBRDtBQUNkLFVBQUE7TUFBQSxJQUFJLENBQUMsVUFBTCxDQUFnQixzQkFBaEI7O1FBQ0Esc0JBQXVCLE9BQUEsQ0FBUSx3QkFBUjs7YUFDdkIsbUJBQW1CLENBQUMsZUFBcEIsQ0FDRSxVQUFBLEdBQWEsY0FEZixFQUVFLFlBQUEsR0FBZSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQWhCLElBQThCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFGL0QsRUFHRSxjQUFBLEdBQWlCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFIbkMsRUFJRSxVQUFBLEdBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBbkIsR0FBc0MsbUJBQW1CLENBQ3BFLGtCQURpRCxDQUM5QixjQUQ4QixDQUF0QyxHQUM2QixJQUw1QztJQUhjLENBaENoQjtJQTRDQSxxQkFBQSxFQUF1QixTQUFDLGNBQUQ7QUFDckIsVUFBQTtBQUFBO1dBQUEsZ0RBQUE7O1FBQ0UsSUFBQSxHQUFPLENBQUMsU0FBRCxFQUNDLFlBREQsRUFFSSxhQUFhLENBQUMsSUFBZixHQUFvQixHQUFwQixHQUF1QixhQUFhLENBQUMsYUFGeEM7cUJBR1AsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaLEVBQWtCLFNBQUMsYUFBRDs7WUFDaEIsc0JBQXVCLE9BQUEsQ0FBUSx3QkFBUjs7aUJBQ3ZCLG1CQUFtQixDQUFDLHNCQUFwQixDQUEyQyxhQUEzQztRQUZnQixDQUFsQjtBQUpGOztJQURxQixDQTVDdkI7SUFzREEsVUFBQSxFQUFZLFNBQUMsSUFBRCxFQUFPLFFBQVA7QUFDVixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBZCxDQUFBO01BQ1YsT0FBQSxHQUFVO01BQ1YsTUFBQSxHQUFTLFNBQUMsTUFBRDtlQUNQLE9BQU8sQ0FBQyxJQUFSLENBQWEsTUFBYjtNQURPO01BRVQsSUFBQSxHQUFPLFNBQUE7ZUFDTCxRQUFBLENBQVMsT0FBVDtNQURLO01BRU4sa0JBQW1CLE9BQUEsQ0FBUSxNQUFSO2FBQ3BCLElBQUksZUFBSixDQUFvQjtRQUFDLFNBQUEsT0FBRDtRQUFVLE1BQUEsSUFBVjtRQUFnQixRQUFBLE1BQWhCO1FBQXdCLE1BQUEsSUFBeEI7T0FBcEI7SUFSVSxDQXREWjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIm1haW4gPSByZXF1aXJlICcuL21haW4nXG5ub3RpZmljYXRpb25IYW5kbGVyID0gbnVsbFxuXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0T3V0ZGF0ZWQ6IC0+XG4gICAgYXJncyA9IFsnb3V0ZGF0ZWQnLCAnLS1qc29uJywgJy0tbm8tY29sb3InXVxuICAgIEBydW5Db21tYW5kIGFyZ3MsIChvdXRkYXRlZFBrZ3NKU09OKSA9PlxuICAgICAgdXBkYXRhYmxlcyA9IEBwYXJzZUFQTU91dHB1dEpTT04ob3V0ZGF0ZWRQa2dzSlNPTilcbiAgICAgIEBzZXRQZW5kaW5nVXBkYXRlcyh1cGRhdGFibGVzKSBpZiB1cGRhdGFibGVzP1xuXG5cbiAgcGFyc2VBUE1PdXRwdXRKU09OOiAoYXBtT3V0cHV0SlNPTikgLT5cbiAgICB0cnlcbiAgICAgIGF2YWlsYWJsZVVwZGF0ZXMgPSBKU09OLnBhcnNlKGFwbU91dHB1dEpTT04pXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIG1haW4udmVyYm9zZU1zZyBcIkVycm9yIHBhcnNpbmcgQVBNIG91dHB1dC5cXG4gI3thcG1PdXRwdXRKU09OfVwiXG4gICAgICByZXR1cm5cbiAgICBmb3IgYXZhaWxhYmxlVXBkYXRlIGluIGF2YWlsYWJsZVVwZGF0ZXNcbiAgICAgICduYW1lJzogYXZhaWxhYmxlVXBkYXRlLm5hbWVcbiAgICAgICdpbnN0YWxsZWRWZXJzaW9uJzogYXZhaWxhYmxlVXBkYXRlLnZlcnNpb25cbiAgICAgICdsYXRlc3RWZXJzaW9uJzogYXZhaWxhYmxlVXBkYXRlLmxhdGVzdFZlcnNpb25cblxuXG4gIHNldFBlbmRpbmdVcGRhdGVzOiAocGVuZGluZ1VwZGF0ZXMpIC0+XG4gICAgaWYgcGVuZGluZ1VwZGF0ZXM/IGFuZCAocGVuZGluZ1VwZGF0ZXMubGVuZ3RoID4gMClcbiAgICAgIG1haW4udmVyYm9zZU1zZyBcIiN7cGVuZGluZ1VwZGF0ZXMubGVuZ3RofVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUje2lmIHBlbmRpbmdVcGRhdGVzLmxlbmd0aCA+IDEgdGhlbiAncycgZWxzZSAnJ31cbiAgICAgICAgICAgICAgICAgICAgZm91bmRcIlxuICAgICAgQHN1bW1vbk5vdGlmaWVyKHBlbmRpbmdVcGRhdGVzKSBpZiBtYWluLnVzZXJDaG9zZW4ubm90aWZ5TWVcbiAgICAgIEBwcm9jZXNzUGVuZGluZ1VwZGF0ZXMocGVuZGluZ1VwZGF0ZXMpIGlmIG1haW4udXNlckNob3Nlbi5hdXRvVXBkYXRlXG4gICAgZWxzZVxuICAgICAgbWFpbi52ZXJib3NlTXNnIFwiTm8gdXBkYXRlKHMpIGZvdW5kXCJcblxuXG4gICMgU3BlY2lmeSB0aGUgY29udGVudCBvZiB0aGUgbm90aWZpY2F0aW9uIGJ1YmJsZS4gQ2FsbGVkIGJ5XG4gICMgICBgQHNldFBlbmRpbmdVcGRhdGVzYCBpZiBgbWFpbi51c2VyQ2hvc2VuLm5vdGlmeU1lYCBpcyB0cnVlXG4gIHN1bW1vbk5vdGlmaWVyOiAocGVuZGluZ1VwZGF0ZXMpIC0+XG4gICAgbWFpbi52ZXJib3NlTXNnICdQb3N0aW5nIG5vdGlmaWNhdGlvbidcbiAgICBub3RpZmljYXRpb25IYW5kbGVyID89IHJlcXVpcmUgJy4vbm90aWZpY2F0aW9uLWhhbmRsZXInXG4gICAgbm90aWZpY2F0aW9uSGFuZGxlci5hbm5vdW5jZVVwZGF0ZXMoXG4gICAgICB1cGRhdGFibGVzID0gcGVuZGluZ1VwZGF0ZXNcbiAgICAgIHNheVNvbWV0aGluZyA9IG1haW4udXNlckNob3Nlbi5hdXRvVXBkYXRlIG9yIG1haW4udXNlckNob3Nlbi5jb25maXJtQWN0aW9uXG4gICAgICBhY3Rpb25SZXF1aXJlZCA9IG1haW4udXNlckNob3Nlbi5jb25maXJtQWN0aW9uXG4gICAgICBjb25maXJtTXNnID0gaWYgbWFpbi51c2VyQ2hvc2VuLmNvbmZpcm1BY3Rpb24gdGhlbiBub3RpZmljYXRpb25IYW5kbGVyLlxuICAgICAgICBnZW5lcmF0ZUNvbmZpcm1Nc2cocGVuZGluZ1VwZGF0ZXMpIGVsc2UgbnVsbFxuICAgIClcblxuXG4gIHByb2Nlc3NQZW5kaW5nVXBkYXRlczogKHBlbmRpbmdVcGRhdGVzKSAtPlxuICAgIGZvciBwZW5kaW5nVXBkYXRlIGluIHBlbmRpbmdVcGRhdGVzXG4gICAgICBhcmdzID0gWydpbnN0YWxsJ1xuICAgICAgICAgICAgICAnLS1uby1jb2xvcidcbiAgICAgICAgICAgICAgXCIje3BlbmRpbmdVcGRhdGUubmFtZX1AI3twZW5kaW5nVXBkYXRlLmxhdGVzdFZlcnNpb259XCJdXG4gICAgICBAcnVuQ29tbWFuZCBhcmdzLCAoYXBtSW5zdGFsbE1zZykgLT5cbiAgICAgICAgbm90aWZpY2F0aW9uSGFuZGxlciA/PSByZXF1aXJlICcuL25vdGlmaWNhdGlvbi1oYW5kbGVyJ1xuICAgICAgICBub3RpZmljYXRpb25IYW5kbGVyLmFubm91bmNlVXBncmFkZU91dGNvbWUoYXBtSW5zdGFsbE1zZylcblxuXG4gIHJ1bkNvbW1hbmQ6IChhcmdzLCBjYWxsYmFjaykgLT5cbiAgICBjb21tYW5kID0gYXRvbS5wYWNrYWdlcy5nZXRBcG1QYXRoKClcbiAgICBvdXRwdXRzID0gW11cbiAgICBzdGRvdXQgPSAob3V0cHV0KSAtPlxuICAgICAgb3V0cHV0cy5wdXNoKG91dHB1dClcbiAgICBleGl0ID0gLT5cbiAgICAgIGNhbGxiYWNrKG91dHB1dHMpXG4gICAge0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuICAgIG5ldyBCdWZmZXJlZFByb2Nlc3Moe2NvbW1hbmQsIGFyZ3MsIHN0ZG91dCwgZXhpdH0pXG4iXX0=
