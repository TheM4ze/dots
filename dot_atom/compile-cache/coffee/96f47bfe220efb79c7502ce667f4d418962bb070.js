(function() {
  var CHECK_DELAY, CachedUserPreferences, debugMode, description, mainScope, mode, modeID, notificationHandler, option, updateHandler;

  mainScope = null;

  updateHandler = null;

  notificationHandler = null;

  debugMode = false;

  CHECK_DELAY = debugMode ? 0 : 30 * 1000;

  option = {
    preset: {
      mode0: {
        key: 'Update automatically and notify me (default)',
        autoUpdate: true,
        notifyMe: true,
        confirmAction: false
      },
      mode1: {
        key: 'Update automatically and silently',
        autoUpdate: true,
        notifyMe: false,
        confirmAction: false
      },
      mode2: {
        key: 'Notify me and let me choose what to do',
        autoUpdate: false,
        notifyMe: true,
        confirmAction: true
      },
      mode3: {
        key: 'Notify me only',
        autoUpdate: false,
        notifyMe: true,
        confirmAction: false
      }
    },
    suppressStatusbarUpdateIcon: {
      disabled: 'Disabled',
      enabled: 'Enabled (default)'
    },
    verboseModes: {
      disabled: 'Disabled (default)',
      enabled: 'Enabled'
    }
  };

  CachedUserPreferences = (function() {
    function CachedUserPreferences(configObj) {
      var _mode, mode, ref;
      this.checkInterval = configObj.frequency * 1000 * 60 * 60;
      ref = option.preset;
      for (_mode in ref) {
        mode = ref[_mode];
        if (!(mode.key === configObj.handling)) {
          continue;
        }
        this.autoUpdate = mode.autoUpdate;
        this.notifyMe = mode.notifyMe;
        this.confirmAction = mode.confirmAction;
      }
      this.suppressStatusbarUpdateIcon = configObj.suppressStatusbarUpdateIcon === option.suppressStatusbarUpdateIcon.enabled;
      this.verbose = configObj.verbose === option.verboseModes.enabled;
    }

    return CachedUserPreferences;

  })();

  module.exports = {
    config: {
      frequency: {
        title: 'Check frequency',
        description: "Check for update every ___ hour(s)\nMinimum: 1 hour",
        type: 'integer',
        "default": 6,
        minimum: 1,
        order: 1
      },
      handling: {
        title: 'Update handling',
        description: 'Action to be taken when update(s) is/are available.',
        type: 'string',
        "enum": (function() {
          var ref, results;
          ref = option.preset;
          results = [];
          for (modeID in ref) {
            mode = ref[modeID];
            results.push(mode.key);
          }
          return results;
        })(),
        "default": option.preset.mode0.key,
        order: 2
      },
      suppressStatusbarUpdateIcon: {
        title: 'Suppress status bar icon/button',
        description: 'If enabled, automatically dismiss the blue "X update(s)" icon/button at the lower right corner of your Atom window.',
        type: 'string',
        "enum": (function() {
          var ref, results;
          ref = option.suppressStatusbarUpdateIcon;
          results = [];
          for (mode in ref) {
            description = ref[mode];
            results.push(description);
          }
          return results;
        })(),
        "default": option.suppressStatusbarUpdateIcon.enabled,
        order: 3
      },
      verbose: {
        title: 'Verbose log',
        description: 'If enabled, log action to console.',
        type: 'string',
        "enum": (function() {
          var ref, results;
          ref = option.verboseModes;
          results = [];
          for (mode in ref) {
            description = ref[mode];
            results.push(description);
          }
          return results;
        })(),
        "default": option.verboseModes.disabled,
        order: 4
      },
      lastUpdateTimestamp: {
        title: 'Lastupdate timestamp',
        description: 'For internal use. Do *NOT* modify.',
        type: 'integer',
        "default": 0,
        minimum: 0,
        order: 9
      }
    },
    userChosen: null,
    activate: function() {
      mainScope = this;
      this.init();
      return this.monitorConfig = atom.config.onDidChange('autoupdate-packages', (function(contrastedValues) {
        var item, newSetting, oldSetting, ref, results;
        ref = contrastedValues.oldValue;
        results = [];
        for (item in ref) {
          oldSetting = ref[item];
          newSetting = contrastedValues.newValue[item];
          if (item !== 'lastUpdateTimestamp' && oldSetting !== newSetting) {
            this.init(contrastedValues.newValue);
            break;
          } else {
            results.push(void 0);
          }
        }
        return results;
      }).bind(mainScope));
    },
    deactivate: function() {
      var hide, ref;
      if ((ref = this.monitorConfig) != null) {
        ref.dispose();
      }
      if (this.scheduledCheck != null) {
        this.verboseMsg('quitting -> clear scheduled check');
        clearTimeout(this.scheduledCheck);
      }
      if (this.knockingStatusbar != null) {
        this.verboseMsg('quitting -> stop searching for `PackageUpdatesStatusView`');
        clearInterval(this.knockingStatusbar);
      }
      return this.hidePackageUpdatesStatusView(hide = false);
    },
    init: function(configObj) {
      if (configObj == null) {
        configObj = this.getConfig();
      }
      if (this.scheduledCheck != null) {
        clearTimeout(this.scheduledCheck);
      }
      if (this.knockingStatusbar != null) {
        clearInterval(this.knockingStatusbar);
      }
      this.userChosen = new CachedUserPreferences(configObj);
      this.verboseMsg("Current mode -> autoUpdate = " + this.userChosen.autoUpdate + ", notifyMe = " + this.userChosen.notifyMe + ", confirmAction = " + this.userChosen.confirmAction + ", suppressStatusbarUpdateIcon = " + this.userChosen.suppressStatusbarUpdateIcon + ", verbose = " + this.userChosen.verbose);
      this.verboseMsg("Timestamp inspection will commence in " + (CHECK_DELAY / 1000) + " s");
      this.scheduledCheck = setTimeout(this.checkTimestamp.bind(mainScope), CHECK_DELAY);
      return this.suppressStatusbarUpdateIcon();
    },
    suppressStatusbarUpdateIcon: function() {
      var TIMEOUT, invokeTime;
      invokeTime = Date.now();
      TIMEOUT = 2 * 60 * 1000;
      this.verboseMsg('looking for `PackageUpdatesStatusView`');
      return this.knockingStatusbar = setInterval((function() {
        var hide, toggled;
        toggled = this.hidePackageUpdatesStatusView(hide = this.userChosen.suppressStatusbarUpdateIcon);
        if (toggled != null) {
          clearInterval(this.knockingStatusbar);
          return this.verboseMsg("`PackageUpdatesStatusView` " + (this.userChosen.suppressStatusbarUpdateIcon ? 'off' : 'on'));
        } else if (Date.now() - invokeTime > TIMEOUT) {
          clearInterval(this.knockingStatusbar);
          return this.verboseMsg("`PackageUpdatesStatusView` not found");
        }
      }).bind(mainScope), 1000);
    },
    hidePackageUpdatesStatusView: function(hide) {
      var button, buttons, i, len;
      if (hide == null) {
        hide = true;
      }
      buttons = document.getElementsByClassName('package-updates-status-view inline-block text text-info');
      if (buttons.length > 0) {
        for (i = 0, len = buttons.length; i < len; i++) {
          button = buttons[i];
          button.style.display = hide ? "None" : "";
        }
        return true;
      }
    },
    checkTimestamp: function(skipped) {
      var nextCheck, timeToNextCheck;
      if (skipped == null) {
        skipped = debugMode;
      }
      this.verboseMsg('Inspecting timestamp');
      nextCheck = this.getConfig('lastUpdateTimestamp') + this.userChosen.checkInterval;
      timeToNextCheck = nextCheck - Date.now();
      if (timeToNextCheck < 0 || skipped) {
        this.verboseMsg('Timestamp expired -> Checking for updates...');
        if (updateHandler == null) {
          updateHandler = require('./update-handler');
        }
        updateHandler.getOutdated();
        this.verboseMsg('Overwriting timestamp');
        atom.config.set('autoupdate-packages.lastUpdateTimestamp', Date.now());
        timeToNextCheck = this.userChosen.checkInterval;
      }
      this.scheduledCheck = setTimeout(this.checkTimestamp.bind(mainScope), timeToNextCheck + 1);
      return this.verboseMsg("Will check for updates again in " + (timeToNextCheck / 1000 / 60) + " minute" + (timeToNextCheck > 1000 * 60 ? 's' : ''));
    },
    getConfig: function(configName) {
      if (configName != null) {
        return atom.config.get("autoupdate-packages." + configName);
      } else {
        return atom.config.get('autoupdate-packages');
      }
    },
    verboseMsg: function(msg, forced) {
      if (forced == null) {
        forced = debugMode;
      }
      if (!(this.userChosen.verbose || forced)) {
        return;
      }
      return console.log("autoupdate-packages: " + msg);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL2F1dG91cGRhdGUtcGFja2FnZXMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxTQUFBLEdBQVk7O0VBQ1osYUFBQSxHQUFnQjs7RUFDaEIsbUJBQUEsR0FBc0I7O0VBTXRCLFNBQUEsR0FBWTs7RUFLWixXQUFBLEdBQWlCLFNBQUgsR0FBa0IsQ0FBbEIsR0FBeUIsRUFBQSxHQUFHOztFQUkxQyxNQUFBLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssOENBQUw7UUFDQSxVQUFBLEVBQVksSUFEWjtRQUNrQixRQUFBLEVBQVUsSUFENUI7UUFDa0MsYUFBQSxFQUFlLEtBRGpEO09BREY7TUFHQSxLQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssbUNBQUw7UUFDQSxVQUFBLEVBQVksSUFEWjtRQUNrQixRQUFBLEVBQVUsS0FENUI7UUFDbUMsYUFBQSxFQUFlLEtBRGxEO09BSkY7TUFNQSxLQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssd0NBQUw7UUFDQSxVQUFBLEVBQVksS0FEWjtRQUNtQixRQUFBLEVBQVUsSUFEN0I7UUFDbUMsYUFBQSxFQUFlLElBRGxEO09BUEY7TUFTQSxLQUFBLEVBQ0U7UUFBQSxHQUFBLEVBQUssZ0JBQUw7UUFDQSxVQUFBLEVBQVksS0FEWjtRQUNtQixRQUFBLEVBQVUsSUFEN0I7UUFDbUMsYUFBQSxFQUFlLEtBRGxEO09BVkY7S0FERjtJQWFBLDJCQUFBLEVBQ0U7TUFBQSxRQUFBLEVBQVUsVUFBVjtNQUNBLE9BQUEsRUFBUyxtQkFEVDtLQWRGO0lBZ0JBLFlBQUEsRUFDRTtNQUFBLFFBQUEsRUFBVSxvQkFBVjtNQUNBLE9BQUEsRUFBUyxTQURUO0tBakJGOzs7RUFxQkk7SUFRUywrQkFBQyxTQUFEO0FBQ1gsVUFBQTtNQUFBLElB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QVosQ0FBZ0IscUJBQWhCLEVBSEY7O0lBRFMsQ0FoSlg7SUF1SkEsVUFBQSxFQUFZLFNBQUMsR0FBRCxFQUFNLE1BQU47O1FBQU0sU0FBUzs7TUFDekIsSUFBQSxDQUFBLENBQWMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLElBQXVCLE1BQXJDLENBQUE7QUFBQSxlQUFBOzthQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksdUJBQUEsR0FBd0IsR0FBcEM7SUFGVSxDQXZKWjs7QUEvREYiLCJzb3VyY2VzQ29udGVudCI6WyJtYWluU2NvcGUgPSBudWxsXG51cGRhdGVIYW5kbGVyID0gbnVsbFxubm90aWZpY2F0aW9uSGFuZGxlciA9IG51bGxcblxuXG4jIERlYnVnIG1vZGVcbiMgSWYgdHJ1ZSwgZW5mb3JjZSBDSEVDS19ERUxBWSA9IDAsIHJlc2V0IGxhc3RVcGRhdGVUaW1lc3RhbXAgYW5kXG4jICAgdHJpZ2dlciBAY2hlY2tUaW1lc3RhbXAgd2hlbiB3aW5kb3cgaXMgKHJlLSlkcmF3blxuZGVidWdNb2RlID0gZmFsc2VcblxuXG4jIFBvc3Rwb25lIHVwZGF0ZSBjaGVja2luZyBhZnRlciBhIG5ldyB3aW5kb3cgaXMgZHJhd24gKGluIG1pbGxpc2Vjb25kKVxuIyBEZWZhdWx0OiAzMCBzZWNvbmRzXG5DSEVDS19ERUxBWSA9IGlmIGRlYnVnTW9kZSB0aGVuIDAgZWxzZSAzMCoxMDAwXG5cblxuIyBQcmVzZXRzIG9mIHVzZXItc2VsZWN0YWJsZSBvcHRpb25zXG5vcHRpb24gPVxuICBwcmVzZXQ6XG4gICAgbW9kZTA6XG4gICAgICBrZXk6ICdVcGRhdGUgYXV0b21hdGljYWxseSBhbmQgbm90aWZ5IG1lIChkZWZhdWx0KSdcbiAgICAgIGF1dG9VcGRhdGU6IHRydWUsIG5vdGlmeU1lOiB0cnVlLCBjb25maXJtQWN0aW9uOiBmYWxzZVxuICAgIG1vZGUxOlxuICAgICAga2V5OiAnVXBkYXRlIGF1dG9tYXRpY2FsbHkgYW5kIHNpbGVudGx5J1xuICAgICAgYXV0b1VwZGF0ZTogdHJ1ZSwgbm90aWZ5TWU6IGZhbHNlLCBjb25maXJtQWN0aW9uOiBmYWxzZVxuICAgIG1vZGUyOlxuICAgICAga2V5OiAnTm90aWZ5IG1lIGFuZCBsZXQgbWUgY2hvb3NlIHdoYXQgdG8gZG8nXG4gICAgICBhdXRvVXBkYXRlOiBmYWxzZSwgbm90aWZ5TWU6IHRydWUsIGNvbmZpcm1BY3Rpb246IHRydWVcbiAgICBtb2RlMzpcbiAgICAgIGtleTogJ05vdGlmeSBtZSBvbmx5J1xuICAgICAgYXV0b1VwZGF0ZTogZmFsc2UsIG5vdGlmeU1lOiB0cnVlLCBjb25maXJtQWN0aW9uOiBmYWxzZVxuICBzdXBwcmVzc1N0YXR1c2JhclVwZGF0ZUljb246XG4gICAgZGlzYWJsZWQ6ICdEaXNhYmxlZCdcbiAgICBlbmFibGVkOiAnRW5hYmxlZCAoZGVmYXVsdCknXG4gIHZlcmJvc2VNb2RlczpcbiAgICBkaXNhYmxlZDogJ0Rpc2FibGVkIChkZWZhdWx0KSdcbiAgICBlbmFibGVkOiAnRW5hYmxlZCdcblxuXG5jbGFzcyBDYWNoZWRVc2VyUHJlZmVyZW5jZXNcbiAgIyBJbnN0YW5jZSBjb250YWluc1xuICAjICAgKiBjaGVja0ludGVydmFsIFtpbnRlZ2VyXVxuICAjICAgKiBhdXRvVXBkYXRlIFtib29sXVxuICAjICAgKiBub3RpZnlNZSBbYm9vbF1cbiAgIyAgICogY29uZmlybUFjdGlvbiBbYm9vbF1cbiAgIyAgICogc3VwcHJlc3NTdGF0dXNiYXJVcGRhdGVJY29uIFtib29sXVxuICAjICAgKiB2ZXJib3NlIFtib29sXVxuICBjb25zdHJ1Y3RvcjogKGNvbmZpZ09iaikgLT5cbiAgICBAY2hlY2tJbnRlcnZhbCA9IGNvbmZpZ09iai5mcmVxdWVuY3kgKiAxMDAwKjYwKjYwXG4gICNcbiAgICBmb3IgX21vZGUsIG1vZGUgb2Ygb3B0aW9uLnByZXNldCB3aGVuIG1vZGUua2V5IGlzIGNvbmZpZ09iai5oYW5kbGluZ1xuICAgICAgQGF1dG9VcGRhdGUgPSBtb2RlLmF1dG9VcGRhdGVcbiAgICAgIEBub3RpZnlNZSA9IG1vZGUubm90aWZ5TWVcbiAgICAgIEBjb25maXJtQWN0aW9uID0gbW9kZS5jb25maXJtQWN0aW9uXG4gICNcbiAgICBAc3VwcHJlc3NTdGF0dXNiYXJVcGRhdGVJY29uID1cbiAgICAgIChjb25maWdPYmouc3VwcHJlc3NTdGF0dXNiYXJVcGRhdGVJY29uIGlzXG4gICAgICAgIG9wdGlvbi5zdXBwcmVzc1N0YXR1c2JhclVwZGF0ZUljb24uZW5hYmxlZClcbiAgI1xuICAgIEB2ZXJib3NlID0gY29uZmlnT2JqLnZlcmJvc2UgaXMgb3B0aW9uLnZlcmJvc2VNb2Rlcy5lbmFibGVkXG5cblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZnJlcXVlbmN5OlxuICAgICAgdGl0bGU6ICdDaGVjayBmcmVxdWVuY3knXG4gICAgICBkZXNjcmlwdGlvbjogXCJDaGVjayBmb3IgdXBkYXRlIGV2ZXJ5IF9fXyBob3VyKHMpXFxuTWluaW11bTogMSBob3VyXCJcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNlxuICAgICAgbWluaW11bTogMVxuICAgICAgb3JkZXI6IDFcbiAgICBoYW5kbGluZzpcbiAgICAgIHRpdGxlOiAnVXBkYXRlIGhhbmRsaW5nJ1xuICAgICAgZGVzY3JpcHRpb246ICdBY3Rpb24gdG8gYmUgdGFrZW4gd2hlbiB1cGRhdGUocykgaXMvYXJlIGF2YWlsYWJsZS4nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZW51bTogKG1vZGUua2V5IGZvciBtb2RlSUQsIG1vZGUgb2Ygb3B0aW9uLnByZXNldClcbiAgICAgIGRlZmF1bHQ6IG9wdGlvbi5wcmVzZXQubW9kZTAua2V5XG4gICAgICBvcmRlcjogMlxuICAgIHN1cHByZXNzU3RhdHVzYmFyVXBkYXRlSWNvbjpcbiAgICAgIHRpdGxlOiAnU3VwcHJlc3Mgc3RhdHVzIGJhciBpY29uL2J1dHRvbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCwgYXV0b21hdGljYWxseSBkaXNtaXNzIHRoZSBibHVlIFwiWCB1cGRhdGUocylcIlxuICAgICAgICAgICAgICAgICAgICBpY29uL2J1dHRvbiBhdCB0aGUgbG93ZXIgcmlnaHQgY29ybmVyIG9mIHlvdXIgQXRvbSB3aW5kb3cuJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGVudW06XG4gICAgICAgIGZvciBtb2RlLCBkZXNjcmlwdGlvbiBvZiBvcHRpb24uc3VwcHJlc3NTdGF0dXNiYXJVcGRhdGVJY29uXG4gICAgICAgICAgZGVzY3JpcHRpb25cbiAgICAgIGRlZmF1bHQ6IG9wdGlvbi5zdXBwcmVzc1N0YXR1c2JhclVwZGF0ZUljb24uZW5hYmxlZFxuICAgICAgb3JkZXI6IDNcbiAgICB2ZXJib3NlOlxuICAgICAgdGl0bGU6ICdWZXJib3NlIGxvZydcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWYgZW5hYmxlZCwgbG9nIGFjdGlvbiB0byBjb25zb2xlLidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBlbnVtOiAoZGVzY3JpcHRpb24gZm9yIG1vZGUsIGRlc2NyaXB0aW9uIG9mIG9wdGlvbi52ZXJib3NlTW9kZXMpXG4gICAgICBkZWZhdWx0OiBvcHRpb24udmVyYm9zZU1vZGVzLmRpc2FibGVkXG4gICAgICBvcmRlcjogNFxuICAgIGxhc3RVcGRhdGVUaW1lc3RhbXA6XG4gICAgICB0aXRsZTogJ0xhc3R1cGRhdGUgdGltZXN0YW1wJ1xuICAgICAgZGVzY3JpcHRpb246ICdGb3IgaW50ZXJuYWwgdXNlLiBEbyAqTk9UKiBtb2RpZnkuJ1xuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAwXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBvcmRlcjogOVxuXG5cbiAgIyBgQ2FjaGVkVXNlclByZWZlcmVuY2VzYCBpbnN0YW5jZTsgZXhwb3J0ZWQgZm9yIHRoZSBoYW5kbGVyc1xuICB1c2VyQ2hvc2VuOiBudWxsXG5cblxuICBhY3RpdmF0ZTogLT5cbiAgICBtYWluU2NvcGUgPSB0aGlzXG4gICAgQGluaXQoKVxuICAgIEBtb25pdG9yQ29uZmlnID0gICMgUmUtaW5pdGlhbGl6ZSB3aGVuIHNldHRpbmdzIGFyZSBtb2RpZmllZFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2F1dG91cGRhdGUtcGFja2FnZXMnLCAoKGNvbnRyYXN0ZWRWYWx1ZXMpIC0+XG4gICAgICAgIGZvciBpdGVtLCBvbGRTZXR0aW5nIG9mIGNvbnRyYXN0ZWRWYWx1ZXMub2xkVmFsdWVcbiAgICAgICAgICBuZXdTZXR0aW5nID0gY29udHJhc3RlZFZhbHVlcy5uZXdWYWx1ZVtpdGVtXVxuICAgICAgICAgIGlmIGl0ZW0gaXNudCAnbGFzdFVwZGF0ZVRpbWVzdGFtcCcgYW5kIG9sZFNldHRpbmcgaXNudCBuZXdTZXR0aW5nXG4gICAgICAgICAgICBAaW5pdChjb250cmFzdGVkVmFsdWVzLm5ld1ZhbHVlKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICkuYmluZChtYWluU2NvcGUpXG5cblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBtb25pdG9yQ29uZmlnPy5kaXNwb3NlKClcbiAgICBpZiBAc2NoZWR1bGVkQ2hlY2s/XG4gICAgICBAdmVyYm9zZU1zZyAncXVpdHRpbmcgLT4gY2xlYXIgc2NoZWR1bGVkIGNoZWNrJ1xuICAgICAgY2xlYXJUaW1lb3V0IEBzY2hlZHVsZWRDaGVja1xuICAgIGlmIEBrbm9ja2luZ1N0YXR1c2Jhcj9cbiAgICAgIEB2ZXJib3NlTXNnICdxdWl0dGluZyAtPiBzdG9wIHNlYXJjaGluZyBmb3IgYFBhY2thZ2VVcGRhdGVzU3RhdHVzVmlld2AnXG4gICAgICBjbGVhckludGVydmFsIEBrbm9ja2luZ1N0YXR1c2JhclxuICAgIEBoaWRlUGFja2FnZVVwZGF0ZXNTdGF0dXNWaWV3KGhpZGUgPSBmYWxzZSlcblxuXG4gIGluaXQ6IChjb25maWdPYmogPSBAZ2V0Q29uZmlnKCkpIC0+XG4gICAgY2xlYXJUaW1lb3V0IEBzY2hlZHVsZWRDaGVjayBpZiBAc2NoZWR1bGVkQ2hlY2s/XG4gICAgY2xlYXJJbnRlcnZhbCBAa25vY2tpbmdTdGF0dXNiYXIgaWYgQGtub2NraW5nU3RhdHVzYmFyP1xuICAgIEB1c2VyQ2hvc2VuID0gbmV3IENhY2hlZFVzZXJQcmVmZXJlbmNlcyBjb25maWdPYmpcbiAgICBAdmVyYm9zZU1zZyBcIkN1cnJlbnQgbW9kZSAtPlxuICAgICAgICAgICAgICAgICAgYXV0b1VwZGF0ZSA9ICN7QHVzZXJDaG9zZW4uYXV0b1VwZGF0ZX0sXG4gICAgICAgICAgICAgICAgICBub3RpZnlNZSA9ICN7QHVzZXJDaG9zZW4ubm90aWZ5TWV9LFxuICAgICAgICAgICAgICAgICAgY29uZmlybUFjdGlvbiA9ICN7QHVzZXJDaG9zZW4uY29uZmlybUFjdGlvbn0sXG4gICAgICAgICAgICAgICAgICBzdXBwcmVzc1N0YXR1c2JhclVwZGF0ZUljb24gPVxuICAgICAgICAgICAgICAgICAgICAje0B1c2VyQ2hvc2VuLnN1cHByZXNzU3RhdHVzYmFyVXBkYXRlSWNvbn0sXG4gICAgICAgICAgICAgICAgICB2ZXJib3NlID0gI3tAdXNlckNob3Nlbi52ZXJib3NlfVwiXG4gICAgIyBTY2hlZHVsZSBpbml0aWFsIHRpbWVzdGFtcCBjaGVjay4gVGhlIGNoZWNrIGlzIGRlbGF5ZWQgdG8gcmVkdWNlIGJ1cmRlblxuICAgICMgICBvbiBBdG9tJ3Mgc3RhcnR1cCBwcm9jZXNzLCB3aGljaCBpcyBhbHJlYWR5IHNsb3dcbiAgICBAdmVyYm9zZU1zZyBcIlRpbWVzdGFtcCBpbnNwZWN0aW9uIHdpbGwgY29tbWVuY2UgaW4gI3tDSEVDS19ERUxBWS8xMDAwfSBzXCJcbiAgICBAc2NoZWR1bGVkQ2hlY2sgPSBzZXRUaW1lb3V0KEBjaGVja1RpbWVzdGFtcC5iaW5kKG1haW5TY29wZSksIENIRUNLX0RFTEFZKVxuICAgICMgSGFja1xuICAgIEBzdXBwcmVzc1N0YXR1c2JhclVwZGF0ZUljb24oKVxuXG5cbiAgc3VwcHJlc3NTdGF0dXNiYXJVcGRhdGVJY29uOiAtPlxuICAgIGludm9rZVRpbWUgPSBEYXRlLm5vdygpXG4gICAgVElNRU9VVCA9IDIgKiA2MCAqIDEwMDBcbiAgICBAdmVyYm9zZU1zZyAnbG9va2luZyBmb3IgYFBhY2thZ2VVcGRhdGVzU3RhdHVzVmlld2AnXG4gICAgQGtub2NraW5nU3RhdHVzYmFyID0gc2V0SW50ZXJ2YWwgKC0+XG4gICAgICB0b2dnbGVkID0gQGhpZGVQYWNrYWdlVXBkYXRlc1N0YXR1c1ZpZXcoaGlkZSA9XG4gICAgICAgICAgICAgICAgICAgIEB1c2VyQ2hvc2VuLnN1cHByZXNzU3RhdHVzYmFyVXBkYXRlSWNvbilcbiAgICAgIGlmIHRvZ2dsZWQ/XG4gICAgICAgIGNsZWFySW50ZXJ2YWwoQGtub2NraW5nU3RhdHVzYmFyKVxuICAgICAgICBAdmVyYm9zZU1zZyBcImBQYWNrYWdlVXBkYXRlc1N0YXR1c1ZpZXdgICN7XG4gICAgICAgICAgaWYgQHVzZXJDaG9zZW4uc3VwcHJlc3NTdGF0dXNiYXJVcGRhdGVJY29uIHRoZW4gJ29mZicgZWxzZSAnb24nfVwiXG4gICAgICBlbHNlIGlmIERhdGUubm93KCkgLSBpbnZva2VUaW1lID4gVElNRU9VVFxuICAgICAgICBjbGVhckludGVydmFsKEBrbm9ja2luZ1N0YXR1c2JhcilcbiAgICAgICAgQHZlcmJvc2VNc2cgXCJgUGFja2FnZVVwZGF0ZXNTdGF0dXNWaWV3YCBub3QgZm91bmRcIlxuICAgICAgKS5iaW5kKG1haW5TY29wZSksIDEwMDBcblxuXG4gICMgSEFDS1xuICAjIFJldHVybiB0aGUgYFBhY2thZ2VVcGRhdGVzU3RhdHVzVmlld2AgVGlsZSBvYmplY3QgY3JlYXRlZCBieSBgc2V0dGluZ3Mtdmlld2BcbiAgIyBnZXRQYWNrYWdlVXBkYXRlc1N0YXR1c1ZpZXc6IC0+XG4gICMgICBmb3IgYm90dG9tUGFuZWwgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tUGFuZWxzKClcbiAgIyAgICAgaWYgYm90dG9tUGFuZWwuaXRlbS5jb25zdHJ1Y3Rvci5uYW1lIGlzICdzdGF0dXMtYmFyJ1xuICAjICAgICAgIGZvciB0aWxlIGluIGJvdHRvbVBhbmVsLml0ZW0ucmlnaHRUaWxlc1xuICAjICAgICAgICAgaWYgdGlsZS5pdGVtLmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1BhY2thZ2VVcGRhdGVzU3RhdHVzVmlldydcbiAgIyAgICAgICAgICAgcmV0dXJuIHRpbGVcblxuXG4gIGhpZGVQYWNrYWdlVXBkYXRlc1N0YXR1c1ZpZXc6IChoaWRlID0gdHJ1ZSkgLT5cbiAgICBidXR0b25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcbiAgICAgICdwYWNrYWdlLXVwZGF0ZXMtc3RhdHVzLXZpZXcgaW5saW5lLWJsb2NrIHRleHQgdGV4dC1pbmZvJylcbiAgICBpZiBidXR0b25zLmxlbmd0aCA+IDBcbiAgICAgIGZvciBidXR0b24gaW4gYnV0dG9uc1xuICAgICAgICBidXR0b24uc3R5bGUuZGlzcGxheSA9IGlmIGhpZGUgdGhlbiBcIk5vbmVcIiBlbHNlIFwiXCJcbiAgICAgIHJldHVybiB0cnVlXG5cblxuICBjaGVja1RpbWVzdGFtcDogKHNraXBwZWQgPSBkZWJ1Z01vZGUpIC0+XG4gICAgQHZlcmJvc2VNc2cgJ0luc3BlY3RpbmcgdGltZXN0YW1wJ1xuICAgIG5leHRDaGVjayA9XG4gICAgICBAZ2V0Q29uZmlnKCdsYXN0VXBkYXRlVGltZXN0YW1wJykgKyBAdXNlckNob3Nlbi5jaGVja0ludGVydmFsXG4gICAgdGltZVRvTmV4dENoZWNrID0gbmV4dENoZWNrIC0gRGF0ZS5ub3coKVxuICAgIGlmIHRpbWVUb05leHRDaGVjayA8IDAgb3Igc2tpcHBlZFxuICAgICAgQHZlcmJvc2VNc2cgJ1RpbWVzdGFtcCBleHBpcmVkIC0+IENoZWNraW5nIGZvciB1cGRhdGVzLi4uJ1xuICAgICAgdXBkYXRlSGFuZGxlciA/PSByZXF1aXJlICcuL3VwZGF0ZS1oYW5kbGVyJ1xuICAgICAgdXBkYXRlSGFuZGxlci5nZXRPdXRkYXRlZCgpXG4gICAgICBAdmVyYm9zZU1zZyAnT3ZlcndyaXRpbmcgdGltZXN0YW1wJ1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvdXBkYXRlLXBhY2thZ2VzLmxhc3RVcGRhdGVUaW1lc3RhbXAnLCBEYXRlLm5vdygpKVxuICAgICAgdGltZVRvTmV4dENoZWNrID0gQHVzZXJDaG9zZW4uY2hlY2tJbnRlcnZhbFxuICAgICMgU2NoZWR1bGUgbmV4dCBjaGVja1xuICAgIEBzY2hlZHVsZWRDaGVjayA9IHNldFRpbWVvdXQoQGNoZWNrVGltZXN0YW1wLmJpbmQobWFpblNjb3BlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVUb05leHRDaGVjayArIDEpXG4gICAgQHZlcmJvc2VNc2cgXCJXaWxsIGNoZWNrIGZvciB1cGRhdGVzIGFnYWluIGluXG4gICAgICAgICAgICAgICAgICAje3RpbWVUb05leHRDaGVjayAvIDEwMDAgLyA2MH1cbiAgICAgICAgICAgICAgICAgIG1pbnV0ZSN7aWYgdGltZVRvTmV4dENoZWNrID4gMTAwMCo2MCB0aGVuICdzJyBlbHNlICcnfVwiXG5cblxuICBnZXRDb25maWc6IChjb25maWdOYW1lKSAtPlxuICAgIGlmIGNvbmZpZ05hbWU/XG4gICAgICBhdG9tLmNvbmZpZy5nZXQoXCJhdXRvdXBkYXRlLXBhY2thZ2VzLiN7Y29uZmlnTmFtZX1cIilcbiAgICBlbHNlXG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ2F1dG91cGRhdGUtcGFja2FnZXMnKVxuXG5cbiAgdmVyYm9zZU1zZzogKG1zZywgZm9yY2VkID0gZGVidWdNb2RlKSAtPlxuICAgIHJldHVybiB1bmxlc3MgQHVzZXJDaG9zZW4udmVyYm9zZSBvciBmb3JjZWRcbiAgICBjb25zb2xlLmxvZyBcImF1dG91cGRhdGUtcGFja2FnZXM6ICN7bXNnfVwiXG4iXX0=
