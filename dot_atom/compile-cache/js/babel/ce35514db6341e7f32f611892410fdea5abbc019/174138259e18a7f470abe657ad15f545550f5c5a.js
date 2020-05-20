var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _atom = require('atom');

var _helpers = require('./helpers');

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.messages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:next': function linterUiDefaultNext() {
        return _this.move(true, true);
      },
      'linter-ui-default:previous': function linterUiDefaultPrevious() {
        return _this.move(false, true);
      },
      'linter-ui-default:next-error': function linterUiDefaultNextError() {
        return _this.move(true, true, 'error');
      },
      'linter-ui-default:previous-error': function linterUiDefaultPreviousError() {
        return _this.move(false, true, 'error');
      },
      'linter-ui-default:next-warning': function linterUiDefaultNextWarning() {
        return _this.move(true, true, 'warning');
      },
      'linter-ui-default:previous-warning': function linterUiDefaultPreviousWarning() {
        return _this.move(false, true, 'warning');
      },
      'linter-ui-default:next-info': function linterUiDefaultNextInfo() {
        return _this.move(true, true, 'info');
      },
      'linter-ui-default:previous-info': function linterUiDefaultPreviousInfo() {
        return _this.move(false, true, 'info');
      },

      'linter-ui-default:next-in-current-file': function linterUiDefaultNextInCurrentFile() {
        return _this.move(true, false);
      },
      'linter-ui-default:previous-in-current-file': function linterUiDefaultPreviousInCurrentFile() {
        return _this.move(false, false);
      },
      'linter-ui-default:next-error-in-current-file': function linterUiDefaultNextErrorInCurrentFile() {
        return _this.move(true, false, 'error');
      },
      'linter-ui-default:previous-error-in-current-file': function linterUiDefaultPreviousErrorInCurrentFile() {
        return _this.move(false, false, 'error');
      },
      'linter-ui-default:next-warning-in-current-file': function linterUiDefaultNextWarningInCurrentFile() {
        return _this.move(true, false, 'warning');
      },
      'linter-ui-default:previous-warning-in-current-file': function linterUiDefaultPreviousWarningInCurrentFile() {
        return _this.move(false, false, 'warning');
      },
      'linter-ui-default:next-info-in-current-file': function linterUiDefaultNextInfoInCurrentFile() {
        return _this.move(true, false, 'info');
      },
      'linter-ui-default:previous-info-in-current-file': function linterUiDefaultPreviousInfoInCurrentFile() {
        return _this.move(false, false, 'info');
      },

      'linter-ui-default:toggle-panel': function linterUiDefaultTogglePanel() {
        return _this.togglePanel();
      },

      // NOTE: Add no-ops here so they are recognized by commands registry
      // Real commands are registered when tooltip is shown inside tooltip's delegate
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip() {},
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {}
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter-ui-default:apply-all-solutions': function linterUiDefaultApplyAllSolutions() {
        return _this.applyAllSolutions();
      }
    }));
    this.subscriptions.add(atom.commands.add('#linter-panel', {
      'core:copy': function coreCopy() {
        var selection = document.getSelection();
        if (selection) {
          atom.clipboard.write(selection.toString());
        }
      }
    }));
  }

  _createClass(Commands, [{
    key: 'togglePanel',
    value: function togglePanel() {
      atom.config.set('linter-ui-default.showPanel', !atom.config.get('linter-ui-default.showPanel'));
    }

    // NOTE: Apply solutions from bottom to top, so they don't invalidate each other
  }, {
    key: 'applyAllSolutions',
    value: function applyAllSolutions() {
      var textEditor = (0, _helpers.getActiveTextEditor)();
      (0, _assert2['default'])(textEditor, 'textEditor was null on a command supposed to run on text-editors only');
      var messages = (0, _helpers.sortMessages)([{ column: 'line', type: 'desc' }], (0, _helpers.filterMessages)(this.messages, textEditor.getPath()));
      messages.forEach(function (message) {
        if (message.version === 2 && message.solutions && message.solutions.length) {
          (0, _helpers.applySolution)(textEditor, (0, _helpers.sortSolutions)(message.solutions)[0]);
        }
      });
    }
  }, {
    key: 'move',
    value: function move(forward, globally) {
      var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var currentEditor = (0, _helpers.getActiveTextEditor)();
      var currentFile = currentEditor && currentEditor.getPath() || NaN;
      // NOTE: ^ Setting default to NaN so it won't match empty file paths in messages
      var messages = (0, _helpers.sortMessages)([{ column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }], (0, _helpers.filterMessages)(this.messages, globally ? null : currentFile, severity));
      var expectedValue = forward ? -1 : 1;

      if (!currentEditor) {
        var message = forward ? messages[0] : messages[messages.length - 1];
        if (message) {
          (0, _helpers.visitMessage)(message);
        }
        return;
      }
      var currentPosition = currentEditor.getCursorBufferPosition();

      // NOTE: Iterate bottom to top to find the previous message
      // Because if we search top to bottom when sorted, first item will always
      // be the smallest
      if (!forward) {
        messages.reverse();
      }

      var found = undefined;
      var currentFileEncountered = false;
      for (var i = 0, _length = messages.length; i < _length; i++) {
        var message = messages[i];
        var messageFile = (0, _helpers.$file)(message);
        var messageRange = (0, _helpers.$range)(message);

        if (!currentFileEncountered && messageFile === currentFile) {
          currentFileEncountered = true;
        }
        if (messageFile && messageRange) {
          if (currentFileEncountered && messageFile !== currentFile) {
            found = message;
            break;
          } else if (messageFile === currentFile && currentPosition.compare(messageRange.start) === expectedValue) {
            found = message;
            break;
          }
        }
      }

      if (!found && messages.length) {
        // Reset back to first or last depending on direction
        found = messages[0];
      }

      if (found) {
        (0, _helpers.visitMessage)(found);
      }
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

module.exports = Commands;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUVzQixRQUFROzs7O29CQUNNLE1BQU07O3VCQVduQyxXQUFXOztJQUdaLFFBQVE7QUFJRCxXQUpQLFFBQVEsR0FJRTs7OzBCQUpWLFFBQVE7O0FBS1YsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ2xDLDhCQUF3QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztPQUFBO0FBQ3JELGtDQUE0QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztPQUFBO0FBQzFELG9DQUE4QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7T0FBQTtBQUNwRSx3Q0FBa0MsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO09BQUE7QUFDekUsc0NBQWdDLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztPQUFBO0FBQ3hFLDBDQUFvQyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7T0FBQTtBQUM3RSxtQ0FBNkIsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO09BQUE7QUFDbEUsdUNBQWlDLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFB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QUFNLE9BQU8sQ0FBQyxDQUFBO0FBQ2xDLFlBQU0sWUFBWSxHQUFHLHFCQUFPLE9BQU8sQ0FBQyxDQUFBOztBQUVwQyxZQUFJLENBQUMsc0JBQXNCLElBQUksV0FBVyxLQUFLLFdBQVcsRUFBRTtBQUMxRCxnQ0FBc0IsR0FBRyxJQUFJLENBQUE7U0FDOUI7QUFDRCxZQUFJLFdBQVcsSUFBSSxZQUFZLEVBQUU7QUFDL0IsY0FBSSxzQkFBc0IsSUFBSSxXQUFXLEtBQUssV0FBVyxFQUFFO0FBQ3pELGlCQUFLLEdBQUcsT0FBTyxDQUFBO0FBQ2Ysa0JBQUs7V0FDTixNQUFNLElBQUksV0FBVyxLQUFLLFdBQVcsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxhQUFhLEVBQUU7QUFDdkcsaUJBQUssR0FBRyxPQUFPLENBQUE7QUFDZixrQkFBSztXQUNOO1NBQ0Y7T0FDRjs7QUFFRCxVQUFJLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7O0FBRTdCLGFBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDcEI7O0FBRUQsVUFBSSxLQUFLLEVBQUU7QUFDVCxtQ0FBYSxLQUFLLENBQUMsQ0FBQTtPQUNwQjtLQUNGOzs7V0FDSyxnQkFBQyxRQUE4QixFQUFFO0FBQ3JDLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0tBQ3pCOzs7V0FDTSxtQkFBUztBQUNkLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQS9IRyxRQUFROzs7QUFrSWQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0J1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCB7XG4gICRmaWxlLFxuICAkcmFuZ2UsXG4gIGdldEFjdGl2ZVRleHRFZGl0b3IsXG4gIHZpc2l0TWVzc2FnZSxcbiAgc29ydE1lc3NhZ2VzLFxuICBzb3J0U29sdXRpb25zLFxuICBmaWx0ZXJNZXNzYWdlcyxcbiAgYXBwbHlTb2x1dGlvbixcbn0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgQ29tbWFuZHMge1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0JzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIHRydWUpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIHRydWUpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1lcnJvcic6ICgpID0+IHRoaXMubW92ZSh0cnVlLCB0cnVlLCAnZXJyb3InKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWVycm9yJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCB0cnVlLCAnZXJyb3InKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtd2FybmluZyc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCB0cnVlLCAnd2FybmluZycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtd2FybmluZyc6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgdHJ1ZSwgJ3dhcm5pbmcnKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtaW5mbyc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCB0cnVlLCAnaW5mbycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtaW5mbyc6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgdHJ1ZSwgJ2luZm8nKSxcblxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCBmYWxzZSksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LWVycm9yLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCBmYWxzZSwgJ2Vycm9yJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpwcmV2aW91cy1lcnJvci1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIGZhbHNlLCAnZXJyb3InKSxcbiAgICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtd2FybmluZy1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UsICd3YXJuaW5nJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpwcmV2aW91cy13YXJuaW5nLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgZmFsc2UsICd3YXJuaW5nJyksXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LWluZm8taW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIGZhbHNlLCAnaW5mbycpLFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtaW5mby1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIGZhbHNlLCAnaW5mbycpLFxuXG4gICAgICAgICdsaW50ZXItdWktZGVmYXVsdDp0b2dnbGUtcGFuZWwnOiAoKSA9PiB0aGlzLnRvZ2dsZVBhbmVsKCksXG5cbiAgICAgICAgLy8gTk9URTogQWRkIG5vLW9wcyBoZXJlIHNvIHRoZXkgYXJlIHJlY29nbml6ZWQgYnkgY29tbWFuZHMgcmVnaXN0cnlcbiAgICAgICAgLy8gUmVhbCBjb21tYW5kcyBhcmUgcmVnaXN0ZXJlZCB3aGVuIHRvb2x0aXAgaXMgc2hvd24gaW5zaWRlIHRvb2x0aXAncyBkZWxlZ2F0ZVxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6ZXhwYW5kLXRvb2x0aXAnOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6Y29sbGFwc2UtdG9vbHRpcCc6IGZ1bmN0aW9uKCkge30sXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJywge1xuICAgICAgICAnbGludGVyLXVpLWRlZmF1bHQ6YXBwbHktYWxsLXNvbHV0aW9ucyc6ICgpID0+IHRoaXMuYXBwbHlBbGxTb2x1dGlvbnMoKSxcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJyNsaW50ZXItcGFuZWwnLCB7XG4gICAgICAgICdjb3JlOmNvcHknOiAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKClcbiAgICAgICAgICBpZiAoc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShzZWxlY3Rpb24udG9TdHJpbmcoKSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApXG4gIH1cbiAgdG9nZ2xlUGFuZWwoKTogdm9pZCB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCAhYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnKSlcbiAgfVxuICAvLyBOT1RFOiBBcHBseSBzb2x1dGlvbnMgZnJvbSBib3R0b20gdG8gdG9wLCBzbyB0aGV5IGRvbid0IGludmFsaWRhdGUgZWFjaCBvdGhlclxuICBhcHBseUFsbFNvbHV0aW9ucygpOiB2b2lkIHtcbiAgICBjb25zdCB0ZXh0RWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaW52YXJpYW50KHRleHRFZGl0b3IsICd0ZXh0RWRpdG9yIHdhcyBudWxsIG9uIGEgY29tbWFuZCBzdXBwb3NlZCB0byBydW4gb24gdGV4dC1lZGl0b3JzIG9ubHknKVxuICAgIGNvbnN0IG1lc3NhZ2VzID0gc29ydE1lc3NhZ2VzKFt7IGNvbHVtbjogJ2xpbmUnLCB0eXBlOiAnZGVzYycgfV0sIGZpbHRlck1lc3NhZ2VzKHRoaXMubWVzc2FnZXMsIHRleHRFZGl0b3IuZ2V0UGF0aCgpKSlcbiAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIgJiYgbWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIGFwcGx5U29sdXRpb24odGV4dEVkaXRvciwgc29ydFNvbHV0aW9ucyhtZXNzYWdlLnNvbHV0aW9ucylbMF0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBtb3ZlKGZvcndhcmQ6IGJvb2xlYW4sIGdsb2JhbGx5OiBib29sZWFuLCBzZXZlcml0eTogP3N0cmluZyA9IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBjdXJyZW50RWRpdG9yID0gZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgY29uc3QgY3VycmVudEZpbGU6IGFueSA9IChjdXJyZW50RWRpdG9yICYmIGN1cnJlbnRFZGl0b3IuZ2V0UGF0aCgpKSB8fCBOYU5cbiAgICAvLyBOT1RFOiBeIFNldHRpbmcgZGVmYXVsdCB0byBOYU4gc28gaXQgd29uJ3QgbWF0Y2ggZW1wdHkgZmlsZSBwYXRocyBpbiBtZXNzYWdlc1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gc29ydE1lc3NhZ2VzKFxuICAgICAgW3sgY29sdW1uOiAnZmlsZScsIHR5cGU6ICdhc2MnIH0sIHsgY29sdW1uOiAnbGluZScsIHR5cGU6ICdhc2MnIH1dLFxuICAgICAgZmlsdGVyTWVzc2FnZXModGhpcy5tZXNzYWdlcywgZ2xvYmFsbHkgPyBudWxsIDogY3VycmVudEZpbGUsIHNldmVyaXR5KSxcbiAgICApXG4gICAgY29uc3QgZXhwZWN0ZWRWYWx1ZSA9IGZvcndhcmQgPyAtMSA6IDFcblxuICAgIGlmICghY3VycmVudEVkaXRvcikge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGZvcndhcmQgPyBtZXNzYWdlc1swXSA6IG1lc3NhZ2VzW21lc3NhZ2VzLmxlbmd0aCAtIDFdXG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICB2aXNpdE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBjdXJyZW50UG9zaXRpb24gPSBjdXJyZW50RWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgIC8vIE5PVEU6IEl0ZXJhdGUgYm90dG9tIHRvIHRvcCB0byBmaW5kIHRoZSBwcmV2aW91cyBtZXNzYWdlXG4gICAgLy8gQmVjYXVzZSBpZiB3ZSBzZWFyY2ggdG9wIHRvIGJvdHRvbSB3aGVuIHNvcnRlZCwgZmlyc3QgaXRlbSB3aWxsIGFsd2F5c1xuICAgIC8vIGJlIHRoZSBzbWFsbGVzdFxuICAgIGlmICghZm9yd2FyZCkge1xuICAgICAgbWVzc2FnZXMucmV2ZXJzZSgpXG4gICAgfVxuXG4gICAgbGV0IGZvdW5kXG4gICAgbGV0IGN1cnJlbnRGaWxlRW5jb3VudGVyZWQgPSBmYWxzZVxuICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBtZXNzYWdlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzW2ldXG4gICAgICBjb25zdCBtZXNzYWdlRmlsZSA9ICRmaWxlKG1lc3NhZ2UpXG4gICAgICBjb25zdCBtZXNzYWdlUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcblxuICAgICAgaWYgKCFjdXJyZW50RmlsZUVuY291bnRlcmVkICYmIG1lc3NhZ2VGaWxlID09PSBjdXJyZW50RmlsZSkge1xuICAgICAgICBjdXJyZW50RmlsZUVuY291bnRlcmVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgaWYgKG1lc3NhZ2VGaWxlICYmIG1lc3NhZ2VSYW5nZSkge1xuICAgICAgICBpZiAoY3VycmVudEZpbGVFbmNvdW50ZXJlZCAmJiBtZXNzYWdlRmlsZSAhPT0gY3VycmVudEZpbGUpIHtcbiAgICAgICAgICBmb3VuZCA9IG1lc3NhZ2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2VGaWxlID09PSBjdXJyZW50RmlsZSAmJiBjdXJyZW50UG9zaXRpb24uY29tcGFyZShtZXNzYWdlUmFuZ2Uuc3RhcnQpID09PSBleHBlY3RlZFZhbHVlKSB7XG4gICAgICAgICAgZm91bmQgPSBtZXNzYWdlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZm91bmQgJiYgbWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAvLyBSZXNldCBiYWNrIHRvIGZpcnN0IG9yIGxhc3QgZGVwZW5kaW5nIG9uIGRpcmVjdGlvblxuICAgICAgZm91bmQgPSBtZXNzYWdlc1swXVxuICAgIH1cblxuICAgIGlmIChmb3VuZCkge1xuICAgICAgdmlzaXRNZXNzYWdlKGZvdW5kKVxuICAgIH1cbiAgfVxuICB1cGRhdGUobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+KSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gIH1cbiAgZGlzcG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21tYW5kc1xuIl19