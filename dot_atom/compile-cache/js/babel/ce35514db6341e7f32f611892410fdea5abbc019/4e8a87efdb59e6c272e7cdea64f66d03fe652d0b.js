Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.$range = $range;
exports.$file = $file;
exports.copySelection = copySelection;
exports.getPathOfMessage = getPathOfMessage;
exports.getActiveTextEditor = getActiveTextEditor;
exports.getEditorsMap = getEditorsMap;
exports.filterMessages = filterMessages;
exports.filterMessagesByRangeOrPoint = filterMessagesByRangeOrPoint;
exports.openFile = openFile;
exports.visitMessage = visitMessage;
exports.openExternally = openExternally;
exports.sortMessages = sortMessages;
exports.sortSolutions = sortSolutions;
exports.applySolution = applySolution;

var _atom = require('atom');

var _electron = require('electron');

var lastPaneItem = null;
var severityScore = {
  error: 3,
  warning: 2,
  info: 1
};

exports.severityScore = severityScore;
var severityNames = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info'
};
exports.severityNames = severityNames;
var WORKSPACE_URI = 'atom://linter-ui-default';
exports.WORKSPACE_URI = WORKSPACE_URI;
var DOCK_ALLOWED_LOCATIONS = ['center', 'bottom'];
exports.DOCK_ALLOWED_LOCATIONS = DOCK_ALLOWED_LOCATIONS;
var DOCK_DEFAULT_LOCATION = 'bottom';

exports.DOCK_DEFAULT_LOCATION = DOCK_DEFAULT_LOCATION;

function $range(message) {
  return message.location.position;
}

function $file(message) {
  return message.location.file;
}

function copySelection() {
  var selection = getSelection();
  if (selection) {
    atom.clipboard.write(selection.toString());
  }
}

function getPathOfMessage(message) {
  return atom.project.relativizePath($file(message) || '')[1];
}

function getActiveTextEditor() {
  var paneItem = atom.workspace.getCenter().getActivePaneItem();
  var paneIsTextEditor = atom.workspace.isTextEditor(paneItem);
  if (!paneIsTextEditor && paneItem && lastPaneItem && paneItem.getURI && paneItem.getURI() === WORKSPACE_URI && (!lastPaneItem.isAlive || lastPaneItem.isAlive())) {
    paneItem = lastPaneItem;
  } else {
    lastPaneItem = paneItem;
  }
  return atom.workspace.isTextEditor(paneItem) ? paneItem : null;
}

function getEditorsMap(editors) {
  var editorsMap = {};
  var filePaths = [];
  for (var entry of editors.editors) {
    var filePath = entry.textEditor.getPath();
    if (editorsMap[filePath]) {
      editorsMap[filePath].editors.push(entry);
    } else {
      editorsMap[filePath] = {
        added: [],
        removed: [],
        editors: [entry]
      };
      filePaths.push(filePath);
    }
  }
  return { editorsMap: editorsMap, filePaths: filePaths };
}

function filterMessages(messages, filePath) {
  var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var filtered = [];
  messages.forEach(function (message) {
    if ((filePath === null || $file(message) === filePath) && (!severity || message.severity === severity)) {
      filtered.push(message);
    }
  });
  return filtered;
}

function filterMessagesByRangeOrPoint(messages, filePath, rangeOrPoint) {
  var filtered = [];
  var expectedRange = rangeOrPoint.constructor.name === 'Point' ? new _atom.Range(rangeOrPoint, rangeOrPoint) : _atom.Range.fromObject(rangeOrPoint);
  messages.forEach(function (message) {
    var file = $file(message);
    var range = $range(message);
    if (file && range && file === filePath && range.intersectsWith(expectedRange)) {
      filtered.push(message);
    }
  });
  return filtered;
}

function openFile(file, position) {
  var options = {};
  options.searchAllPanes = true;
  if (position) {
    options.initialLine = position.row;
    options.initialColumn = position.column;
  }
  atom.workspace.open(file, options);
}

function visitMessage(message) {
  var reference = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  var messageFile = undefined;
  var messagePosition = undefined;
  if (reference) {
    if (!message.reference || !message.reference.file) {
      console.warn('[Linter-UI-Default] Message does not have a valid reference. Ignoring');
      return;
    }
    messageFile = message.reference.file;
    messagePosition = message.reference.position;
  } else {
    var messageRange = $range(message);
    messageFile = $file(message);
    if (messageRange) {
      messagePosition = messageRange.start;
    }
  }
  if (messageFile) {
    openFile(messageFile, messagePosition);
  }
}

function openExternally(message) {
  if (message.version === 2 && message.url) {
    _electron.shell.openExternal(message.url);
  }
}

function sortMessages(sortInfo, rows) {
  var sortColumns = {};

  sortInfo.forEach(function (entry) {
    sortColumns[entry.column] = entry.type;
  });

  return rows.slice().sort(function (a, b) {
    if (sortColumns.severity) {
      var multiplyWith = sortColumns.severity === 'asc' ? 1 : -1;
      var severityA = severityScore[a.severity];
      var severityB = severityScore[b.severity];
      if (severityA !== severityB) {
        return multiplyWith * (severityA > severityB ? 1 : -1);
      }
    }
    if (sortColumns.linterName) {
      var multiplyWith = sortColumns.linterName === 'asc' ? 1 : -1;
      var sortValue = a.severity.localeCompare(b.severity);
      if (sortValue !== 0) {
        return multiplyWith * sortValue;
      }
    }
    if (sortColumns.file) {
      var multiplyWith = sortColumns.file === 'asc' ? 1 : -1;
      var fileA = getPathOfMessage(a);
      var fileALength = fileA.length;
      var fileB = getPathOfMessage(b);
      var fileBLength = fileB.length;
      if (fileALength !== fileBLength) {
        return multiplyWith * (fileALength > fileBLength ? 1 : -1);
      } else if (fileA !== fileB) {
        return multiplyWith * fileA.localeCompare(fileB);
      }
    }
    if (sortColumns.line) {
      var multiplyWith = sortColumns.line === 'asc' ? 1 : -1;
      var rangeA = $range(a);
      var rangeB = $range(b);
      if (rangeA && !rangeB) {
        return 1;
      } else if (rangeB && !rangeA) {
        return -1;
      } else if (rangeA && rangeB) {
        if (rangeA.start.row !== rangeB.start.row) {
          return multiplyWith * (rangeA.start.row > rangeB.start.row ? 1 : -1);
        }
        if (rangeA.start.column !== rangeB.start.column) {
          return multiplyWith * (rangeA.start.column > rangeB.start.column ? 1 : -1);
        }
      }
    }

    return 0;
  });
}

function sortSolutions(solutions) {
  return solutions.slice().sort(function (a, b) {
    return b.priority - a.priority;
  });
}

function applySolution(textEditor, solution) {
  if (solution.apply) {
    solution.apply();
    return true;
  }
  var range = solution.position;
  var currentText = solution.currentText;
  var replaceWith = solution.replaceWith;
  if (currentText) {
    var textInRange = textEditor.getTextInBufferRange(range);
    if (currentText !== textInRange) {
      console.warn('[linter-ui-default] Not applying fix because text did not match the expected one', 'expected', currentText, 'but got', textInRange);
      return false;
    }
  }
  textEditor.setTextInBufferRange(range, replaceWith);
  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07O3dCQUNOLFVBQVU7O0FBS2hDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQTtBQUNoQixJQUFNLGFBQWEsR0FBRztBQUMzQixPQUFLLEVBQUUsQ0FBQztBQUNSLFNBQU8sRUFBRSxDQUFDO0FBQ1YsTUFBSSxFQUFFLENBQUM7Q0FDUixDQUFBOzs7QUFFTSxJQUFNLGFBQWEsR0FBRztBQUMzQixPQUFLLEVBQUUsT0FBTztBQUNkLFNBQU8sRUFBRSxTQUFTO0FBQ2xCLE1BQUksRUFBRSxNQUFNO0NBQ2IsQ0FBQTs7QUFDTSxJQUFNLGFBQWEsR0FBRywwQkFBMEIsQ0FBQTs7QUFDaEQsSUFBTSxzQkFBc0IsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFDbkQsSUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUE7Ozs7QUFFdEMsU0FBUyxNQUFNLENBQUMsT0FBc0IsRUFBVztBQUN0RCxTQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFBO0NBQ2pDOztBQUNNLFNBQVMsS0FBSyxDQUFDLE9BQXNCLEVBQVc7QUFDckQsU0FBTyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQTtDQUM3Qjs7QUFDTSxTQUFTLGFBQWEsR0FBRztBQUM5QixNQUFNLFNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQTtBQUNoQyxNQUFJLFNBQVMsRUFBRTtBQUNiLFFBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0dBQzNDO0NBQ0Y7O0FBQ00sU0FBUyxnQkFBZ0IsQ0FBQyxPQUFzQixFQUFVO0FBQy9ELFNBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8s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QUFBO0FBQ2hCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7QUFDRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFBO0FBQy9CLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUE7QUFDeEMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQTtBQUN4QyxNQUFJLFdBQVcsRUFBRTtBQUNmLFFBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMxRCxRQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7QUFDL0IsYUFBTyxDQUFDLElBQUksQ0FDVixrRkFBa0YsRUFDbEYsVUFBVSxFQUNWLFdBQVcsRUFDWCxTQUFTLEVBQ1QsV0FBVyxDQUNaLENBQUE7QUFDRCxhQUFPLEtBQUssQ0FBQTtLQUNiO0dBQ0Y7QUFDRCxZQUFVLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ25ELFNBQU8sSUFBSSxDQUFBO0NBQ1oiLCJmaWxlIjoiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgc2hlbGwgfSBmcm9tICdlbGVjdHJvbidcbmltcG9ydCB0eXBlIHsgUG9pbnQsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgRWRpdG9ycyBmcm9tICcuL2VkaXRvcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgbGFzdFBhbmVJdGVtID0gbnVsbFxuZXhwb3J0IGNvbnN0IHNldmVyaXR5U2NvcmUgPSB7XG4gIGVycm9yOiAzLFxuICB3YXJuaW5nOiAyLFxuICBpbmZvOiAxLFxufVxuXG5leHBvcnQgY29uc3Qgc2V2ZXJpdHlOYW1lcyA9IHtcbiAgZXJyb3I6ICdFcnJvcicsXG4gIHdhcm5pbmc6ICdXYXJuaW5nJyxcbiAgaW5mbzogJ0luZm8nLFxufVxuZXhwb3J0IGNvbnN0IFdPUktTUEFDRV9VUkkgPSAnYXRvbTovL2xpbnRlci11aS1kZWZhdWx0J1xuZXhwb3J0IGNvbnN0IERPQ0tfQUxMT1dFRF9MT0NBVElPTlMgPSBbJ2NlbnRlcicsICdib3R0b20nXVxuZXhwb3J0IGNvbnN0IERPQ0tfREVGQVVMVF9MT0NBVElPTiA9ICdib3R0b20nXG5cbmV4cG9ydCBmdW5jdGlvbiAkcmFuZ2UobWVzc2FnZTogTGludGVyTWVzc2FnZSk6ID9PYmplY3Qge1xuICByZXR1cm4gbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvblxufVxuZXhwb3J0IGZ1bmN0aW9uICRmaWxlKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UpOiA/c3RyaW5nIHtcbiAgcmV0dXJuIG1lc3NhZ2UubG9jYXRpb24uZmlsZVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlTZWxlY3Rpb24oKSB7XG4gIGNvbnN0IHNlbGVjdGlvbiA9IGdldFNlbGVjdGlvbigpXG4gIGlmIChzZWxlY3Rpb24pIHtcbiAgICBhdG9tLmNsaXBib2FyZC53cml0ZShzZWxlY3Rpb24udG9TdHJpbmcoKSlcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhdGhPZk1lc3NhZ2UobWVzc2FnZTogTGludGVyTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoJGZpbGUobWVzc2FnZSkgfHwgJycpWzFdXG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0QWN0aXZlVGV4dEVkaXRvcigpOiA/VGV4dEVkaXRvciB7XG4gIGxldCBwYW5lSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgY29uc3QgcGFuZUlzVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihwYW5lSXRlbSlcbiAgaWYgKFxuICAgICFwYW5lSXNUZXh0RWRpdG9yICYmXG4gICAgcGFuZUl0ZW0gJiZcbiAgICBsYXN0UGFuZUl0ZW0gJiZcbiAgICBwYW5lSXRlbS5nZXRVUkkgJiZcbiAgICBwYW5lSXRlbS5nZXRVUkkoKSA9PT0gV09SS1NQQUNFX1VSSSAmJlxuICAgICghbGFzdFBhbmVJdGVtLmlzQWxpdmUgfHwgbGFzdFBhbmVJdGVtLmlzQWxpdmUoKSlcbiAgKSB7XG4gICAgcGFuZUl0ZW0gPSBsYXN0UGFuZUl0ZW1cbiAgfSBlbHNlIHtcbiAgICBsYXN0UGFuZUl0ZW0gPSBwYW5lSXRlbVxuICB9XG4gIHJldHVybiBhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IocGFuZUl0ZW0pID8gcGFuZUl0ZW0gOiBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0b3JzTWFwKGVkaXRvcnM6IEVkaXRvcnMpOiB7IGVkaXRvcnNNYXA6IE9iamVjdCwgZmlsZVBhdGhzOiBBcnJheTxzdHJpbmc+IH0ge1xuICBjb25zdCBlZGl0b3JzTWFwID0ge31cbiAgY29uc3QgZmlsZVBhdGhzID0gW11cbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlZGl0b3JzLmVkaXRvcnMpIHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVudHJ5LnRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgKGVkaXRvcnNNYXBbZmlsZVBhdGhdKSB7XG4gICAgICBlZGl0b3JzTWFwW2ZpbGVQYXRoXS5lZGl0b3JzLnB1c2goZW50cnkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGVkaXRvcnNNYXBbZmlsZVBhdGhdID0ge1xuICAgICAgICBhZGRlZDogW10sXG4gICAgICAgIHJlbW92ZWQ6IFtdLFxuICAgICAgICBlZGl0b3JzOiBbZW50cnldLFxuICAgICAgfVxuICAgICAgZmlsZVBhdGhzLnB1c2goZmlsZVBhdGgpXG4gICAgfVxuICB9XG4gIHJldHVybiB7IGVkaXRvcnNNYXAsIGZpbGVQYXRocyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNZXNzYWdlcyhcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+LFxuICBmaWxlUGF0aDogP3N0cmluZyxcbiAgc2V2ZXJpdHk6ID9zdHJpbmcgPSBudWxsLFxuKTogQXJyYXk8TGludGVyTWVzc2FnZT4ge1xuICBjb25zdCBmaWx0ZXJlZCA9IFtdXG4gIG1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIGlmICgoZmlsZVBhdGggPT09IG51bGwgfHwgJGZpbGUobWVzc2FnZSkgPT09IGZpbGVQYXRoKSAmJiAoIXNldmVyaXR5IHx8IG1lc3NhZ2Uuc2V2ZXJpdHkgPT09IHNldmVyaXR5KSkge1xuICAgICAgZmlsdGVyZWQucHVzaChtZXNzYWdlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGZpbHRlcmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50KFxuICBtZXNzYWdlczogU2V0PExpbnRlck1lc3NhZ2U+IHwgQXJyYXk8TGludGVyTWVzc2FnZT4sXG4gIGZpbGVQYXRoOiBzdHJpbmcsXG4gIHJhbmdlT3JQb2ludDogUG9pbnQgfCBSYW5nZSxcbik6IEFycmF5PExpbnRlck1lc3NhZ2U+IHtcbiAgY29uc3QgZmlsdGVyZWQgPSBbXVxuICBjb25zdCBleHBlY3RlZFJhbmdlID1cbiAgICByYW5nZU9yUG9pbnQuY29uc3RydWN0b3IubmFtZSA9PT0gJ1BvaW50JyA/IG5ldyBSYW5nZShyYW5nZU9yUG9pbnQsIHJhbmdlT3JQb2ludCkgOiBSYW5nZS5mcm9tT2JqZWN0KHJhbmdlT3JQb2ludClcbiAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgY29uc3QgZmlsZSA9ICRmaWxlKG1lc3NhZ2UpXG4gICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICBpZiAoZmlsZSAmJiByYW5nZSAmJiBmaWxlID09PSBmaWxlUGF0aCAmJiByYW5nZS5pbnRlcnNlY3RzV2l0aChleHBlY3RlZFJhbmdlKSkge1xuICAgICAgZmlsdGVyZWQucHVzaChtZXNzYWdlKVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGZpbHRlcmVkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvcGVuRmlsZShmaWxlOiBzdHJpbmcsIHBvc2l0aW9uOiA/UG9pbnQpIHtcbiAgY29uc3Qgb3B0aW9ucyA9IHt9XG4gIG9wdGlvbnMuc2VhcmNoQWxsUGFuZXMgPSB0cnVlXG4gIGlmIChwb3NpdGlvbikge1xuICAgIG9wdGlvbnMuaW5pdGlhbExpbmUgPSBwb3NpdGlvbi5yb3dcbiAgICBvcHRpb25zLmluaXRpYWxDb2x1bW4gPSBwb3NpdGlvbi5jb2x1bW5cbiAgfVxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUsIG9wdGlvbnMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpdE1lc3NhZ2UobWVzc2FnZTogTGludGVyTWVzc2FnZSwgcmVmZXJlbmNlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgbGV0IG1lc3NhZ2VGaWxlXG4gIGxldCBtZXNzYWdlUG9zaXRpb25cbiAgaWYgKHJlZmVyZW5jZSkge1xuICAgIGlmICghbWVzc2FnZS5yZWZlcmVuY2UgfHwgIW1lc3NhZ2UucmVmZXJlbmNlLmZpbGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xpbnRlci1VSS1EZWZhdWx0XSBNZXNzYWdlIGRvZXMgbm90IGhhdmUgYSB2YWxpZCByZWZlcmVuY2UuIElnbm9yaW5nJylcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBtZXNzYWdlRmlsZSA9IG1lc3NhZ2UucmVmZXJlbmNlLmZpbGVcbiAgICBtZXNzYWdlUG9zaXRpb24gPSBtZXNzYWdlLnJlZmVyZW5jZS5wb3NpdGlvblxuICB9IGVsc2Uge1xuICAgIGNvbnN0IG1lc3NhZ2VSYW5nZSA9ICRyYW5nZShtZXNzYWdlKVxuICAgIG1lc3NhZ2VGaWxlID0gJGZpbGUobWVzc2FnZSlcbiAgICBpZiAobWVzc2FnZVJhbmdlKSB7XG4gICAgICBtZXNzYWdlUG9zaXRpb24gPSBtZXNzYWdlUmFuZ2Uuc3RhcnRcbiAgICB9XG4gIH1cbiAgaWYgKG1lc3NhZ2VGaWxlKSB7XG4gICAgb3BlbkZpbGUobWVzc2FnZUZpbGUsIG1lc3NhZ2VQb3NpdGlvbilcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkV4dGVybmFsbHkobWVzc2FnZTogTGludGVyTWVzc2FnZSk6IHZvaWQge1xuICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAyICYmIG1lc3NhZ2UudXJsKSB7XG4gICAgc2hlbGwub3BlbkV4dGVybmFsKG1lc3NhZ2UudXJsKVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0TWVzc2FnZXMoXG4gIHNvcnRJbmZvOiBBcnJheTx7IGNvbHVtbjogc3RyaW5nLCB0eXBlOiAnYXNjJyB8ICdkZXNjJyB9PixcbiAgcm93czogQXJyYXk8TGludGVyTWVzc2FnZT4sXG4pOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gIGNvbnN0IHNvcnRDb2x1bW5zOiB7XG4gICAgc2V2ZXJpdHk/OiAnYXNjJyB8ICdkZXNjJyxcbiAgICBsaW50ZXJOYW1lPzogJ2FzYycgfCAnZGVzYycsXG4gICAgZmlsZT86ICdhc2MnIHwgJ2Rlc2MnLFxuICAgIGxpbmU/OiAnYXNjJyB8ICdkZXNjJyxcbiAgfSA9IHt9XG5cbiAgc29ydEluZm8uZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIHNvcnRDb2x1bW5zW2VudHJ5LmNvbHVtbl0gPSBlbnRyeS50eXBlXG4gIH0pXG5cbiAgcmV0dXJuIHJvd3Muc2xpY2UoKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAoc29ydENvbHVtbnMuc2V2ZXJpdHkpIHtcbiAgICAgIGNvbnN0IG11bHRpcGx5V2l0aCA9IHNvcnRDb2x1bW5zLnNldmVyaXR5ID09PSAnYXNjJyA/IDEgOiAtMVxuICAgICAgY29uc3Qgc2V2ZXJpdHlBID0gc2V2ZXJpdHlTY29yZVthLnNldmVyaXR5XVxuICAgICAgY29uc3Qgc2V2ZXJpdHlCID0gc2V2ZXJpdHlTY29yZVtiLnNldmVyaXR5XVxuICAgICAgaWYgKHNldmVyaXR5QSAhPT0gc2V2ZXJpdHlCKSB7XG4gICAgICAgIHJldHVybiBtdWx0aXBseVdpdGggKiAoc2V2ZXJpdHlBID4gc2V2ZXJpdHlCID8gMSA6IC0xKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc29ydENvbHVtbnMubGludGVyTmFtZSkge1xuICAgICAgY29uc3QgbXVsdGlwbHlXaXRoID0gc29ydENvbHVtbnMubGludGVyTmFtZSA9PT0gJ2FzYycgPyAxIDogLTFcbiAgICAgIGNvbnN0IHNvcnRWYWx1ZSA9IGEuc2V2ZXJpdHkubG9jYWxlQ29tcGFyZShiLnNldmVyaXR5KVxuICAgICAgaWYgKHNvcnRWYWx1ZSAhPT0gMCkge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogc29ydFZhbHVlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzb3J0Q29sdW1ucy5maWxlKSB7XG4gICAgICBjb25zdCBtdWx0aXBseVdpdGggPSBzb3J0Q29sdW1ucy5maWxlID09PSAnYXNjJyA/IDEgOiAtMVxuICAgICAgY29uc3QgZmlsZUEgPSBnZXRQYXRoT2ZNZXNzYWdlKGEpXG4gICAgICBjb25zdCBmaWxlQUxlbmd0aCA9IGZpbGVBLmxlbmd0aFxuICAgICAgY29uc3QgZmlsZUIgPSBnZXRQYXRoT2ZNZXNzYWdlKGIpXG4gICAgICBjb25zdCBmaWxlQkxlbmd0aCA9IGZpbGVCLmxlbmd0aFxuICAgICAgaWYgKGZpbGVBTGVuZ3RoICE9PSBmaWxlQkxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogKGZpbGVBTGVuZ3RoID4gZmlsZUJMZW5ndGggPyAxIDogLTEpXG4gICAgICB9IGVsc2UgaWYgKGZpbGVBICE9PSBmaWxlQikge1xuICAgICAgICByZXR1cm4gbXVsdGlwbHlXaXRoICogZmlsZUEubG9jYWxlQ29tcGFyZShmaWxlQilcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNvcnRDb2x1bW5zLmxpbmUpIHtcbiAgICAgIGNvbnN0IG11bHRpcGx5V2l0aCA9IHNvcnRDb2x1bW5zLmxpbmUgPT09ICdhc2MnID8gMSA6IC0xXG4gICAgICBjb25zdCByYW5nZUEgPSAkcmFuZ2UoYSlcbiAgICAgIGNvbnN0IHJhbmdlQiA9ICRyYW5nZShiKVxuICAgICAgaWYgKHJhbmdlQSAmJiAhcmFuZ2VCKSB7XG4gICAgICAgIHJldHVybiAxXG4gICAgICB9IGVsc2UgaWYgKHJhbmdlQiAmJiAhcmFuZ2VBKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfSBlbHNlIGlmIChyYW5nZUEgJiYgcmFuZ2VCKSB7XG4gICAgICAgIGlmIChyYW5nZUEuc3RhcnQucm93ICE9PSByYW5nZUIuc3RhcnQucm93KSB7XG4gICAgICAgICAgcmV0dXJuIG11bHRpcGx5V2l0aCAqIChyYW5nZUEuc3RhcnQucm93ID4gcmFuZ2VCLnN0YXJ0LnJvdyA/IDEgOiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpZiAocmFuZ2VBLnN0YXJ0LmNvbHVtbiAhPT0gcmFuZ2VCLnN0YXJ0LmNvbHVtbikge1xuICAgICAgICAgIHJldHVybiBtdWx0aXBseVdpdGggKiAocmFuZ2VBLnN0YXJ0LmNvbHVtbiA+IHJhbmdlQi5zdGFydC5jb2x1bW4gPyAxIDogLTEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc29ydFNvbHV0aW9ucyhzb2x1dGlvbnM6IEFycmF5PE9iamVjdD4pOiBBcnJheTxPYmplY3Q+IHtcbiAgcmV0dXJuIHNvbHV0aW9ucy5zbGljZSgpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTb2x1dGlvbih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCBzb2x1dGlvbjogT2JqZWN0KTogYm9vbGVhbiB7XG4gIGlmIChzb2x1dGlvbi5hcHBseSkge1xuICAgIHNvbHV0aW9uLmFwcGx5KClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGNvbnN0IHJhbmdlID0gc29sdXRpb24ucG9zaXRpb25cbiAgY29uc3QgY3VycmVudFRleHQgPSBzb2x1dGlvbi5jdXJyZW50VGV4dFxuICBjb25zdCByZXBsYWNlV2l0aCA9IHNvbHV0aW9uLnJlcGxhY2VXaXRoXG4gIGlmIChjdXJyZW50VGV4dCkge1xuICAgIGNvbnN0IHRleHRJblJhbmdlID0gdGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcbiAgICBpZiAoY3VycmVudFRleHQgIT09IHRleHRJblJhbmdlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdbbGludGVyLXVpLWRlZmF1bHRdIE5vdCBhcHBseWluZyBmaXggYmVjYXVzZSB0ZXh0IGRpZCBub3QgbWF0Y2ggdGhlIGV4cGVjdGVkIG9uZScsXG4gICAgICAgICdleHBlY3RlZCcsXG4gICAgICAgIGN1cnJlbnRUZXh0LFxuICAgICAgICAnYnV0IGdvdCcsXG4gICAgICAgIHRleHRJblJhbmdlLFxuICAgICAgKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIHRleHRFZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2UsIHJlcGxhY2VXaXRoKVxuICByZXR1cm4gdHJ1ZVxufVxuIl19