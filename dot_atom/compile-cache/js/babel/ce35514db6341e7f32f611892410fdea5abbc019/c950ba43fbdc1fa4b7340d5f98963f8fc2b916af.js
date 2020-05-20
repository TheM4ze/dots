var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _dock = require('./dock');

var _dock2 = _interopRequireDefault(_dock);

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.messages = [];
    this.deactivating = false;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPane(function (_ref) {
      var destroyedPane = _ref.pane;

      var isPaneItemDestroyed = destroyedPane.getItems().includes(_this.panel);
      if (isPaneItemDestroyed && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref2) {
      var paneItem = _ref2.item;

      if (paneItem instanceof _dock2['default'] && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      _this.showPanelStateMessages = !!_this.delegate.filteredMessages.length;
      _this.refresh();
    }));
    this.activationTimer = window.requestIdleCallback(function () {
      var firstTime = true;
      var dock = atom.workspace.getBottomDock();
      _this.subscriptions.add(dock.onDidChangeActivePaneItem(function (paneItem) {
        if (!_this.panel || _this.getPanelLocation() !== 'bottom') {
          return;
        }
        if (firstTime) {
          firstTime = false;
          return;
        }
        var isFocusIn = paneItem === _this.panel;
        var externallyToggled = isFocusIn !== _this.showPanelConfig;
        if (externallyToggled) {
          atom.config.set('linter-ui-default.showPanel', !_this.showPanelConfig);
        }
      }));
      _this.subscriptions.add(dock.onDidChangeVisible(function (visible) {
        if (!_this.panel || _this.getPanelLocation() !== 'bottom') {
          return;
        }
        if (!visible) {
          // ^ When it's time to tell config to hide
          if (_this.showPanelConfig && _this.hidePanelWhenEmpty && !_this.showPanelStateMessages) {
            // Ignore because we just don't have any messages to show, everything else is fine
            return;
          }
        }
        var externallyToggled = visible !== _this.showPanelConfig;
        if (externallyToggled) {
          atom.config.set('linter-ui-default.showPanel', !_this.showPanelConfig);
        }
      }));

      _this.activate();
    });
  }

  _createClass(Panel, [{
    key: 'getPanelLocation',
    value: function getPanelLocation() {
      if (!this.panel) {
        return null;
      }
      var paneContainer = atom.workspace.paneContainerForItem(this.panel);
      return paneContainer && paneContainer.location || null;
    }
  }, {
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        return;
      }
      this.panel = new _dock2['default'](this.delegate);
      yield atom.workspace.open(this.panel, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      });
      this.update();
      this.refresh();
    })
  }, {
    key: 'update',
    value: function update() {
      var newMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (newMessages) {
        this.messages = newMessages;
      }
      this.delegate.update(this.messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      var panel = this.panel;
      if (panel === null) {
        if (this.showPanelConfig) {
          yield this.activate();
        }
        return;
      }
      var paneContainer = atom.workspace.paneContainerForItem(panel);
      if (!paneContainer || paneContainer.location !== 'bottom') {
        return;
      }
      var isActivePanel = paneContainer.getActivePaneItem() === panel;
      var visibilityAllowed1 = this.showPanelConfig;
      var visibilityAllowed2 = this.hidePanelWhenEmpty ? this.showPanelStateMessages : true;
      if (visibilityAllowed1 && visibilityAllowed2) {
        if (!isActivePanel) {
          paneContainer.paneForItem(panel).activateItem(panel);
        }
        paneContainer.show();
        panel.doPanelResize();
      } else if (isActivePanel) {
        paneContainer.hide();
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivating = true;
      if (this.panel) {
        this.panel.dispose();
      }
      this.subscriptions.dispose();
      window.cancelIdleCallback(this.activationTimer);
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUNyQixZQUFZOzs7O29CQUNYLFFBQVE7Ozs7SUFHeEIsS0FBSztBQVdFLFdBWFAsS0FBSyxHQVdLOzs7MEJBWFYsS0FBSzs7QUFZUCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQTs7QUFFbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFBLGtCQUFrQixFQUFJO0FBQ2hGLFlBQUssa0JBQWtCLEdBQUcsa0JBQWtCLENBQUE7QUFDNUMsWUFBSyxPQUFPLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FDSCxDQUFBO0FBQ0QsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxJQUF1QixFQUFLO1VBQXBCLGFBQWEsR0FBckIsSUFBdUIsQ0FBckIsSUFBSTs7QUFDckMsVUFBTSxtQkFBbUIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMs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Q0QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixZQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO0tBQ2hEOzs7U0E3SkcsS0FBSzs7O0FBZ0tYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6Ii9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IFBhbmVsRG9jayBmcm9tICcuL2RvY2snXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgUGFuZWwge1xuICBwYW5lbDogUGFuZWxEb2NrIHwgbnVsbFxuICBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBkZWxlZ2F0ZTogRGVsZWdhdGVcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+XG4gIGRlYWN0aXZhdGluZzogYm9vbGVhblxuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHNob3dQYW5lbENvbmZpZzogYm9vbGVhblxuICBoaWRlUGFuZWxXaGVuRW1wdHk6IGJvb2xlYW5cbiAgc2hvd1BhbmVsU3RhdGVNZXNzYWdlczogYm9vbGVhblxuICBhY3RpdmF0aW9uVGltZXI6IG51bWJlclxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBhbmVsID0gbnVsbFxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSgpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5kZWFjdGl2YXRpbmcgPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLnNob3dQYW5lbFN0YXRlTWVzc2FnZXMgPSBmYWxzZVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmRlbGVnYXRlKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5oaWRlUGFuZWxXaGVuRW1wdHknLCBoaWRlUGFuZWxXaGVuRW1wdHkgPT4ge1xuICAgICAgICB0aGlzLmhpZGVQYW5lbFdoZW5FbXB0eSA9IGhpZGVQYW5lbFdoZW5FbXB0eVxuICAgICAgICB0aGlzLnJlZnJlc2goKVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lKCh7IHBhbmU6IGRlc3Ryb3llZFBhbmUgfSkgPT4ge1xuICAgICAgICBjb25zdCBpc1BhbmVJdGVtRGVzdHJveWVkID0gZGVzdHJveWVkUGFuZS5nZXRJdGVtcygpLmluY2x1ZGVzKHRoaXMucGFuZWwpXG4gICAgICAgIGlmIChpc1BhbmVJdGVtRGVzdHJveWVkICYmICF0aGlzLmRlYWN0aXZhdGluZykge1xuICAgICAgICAgIHRoaXMucGFuZWwgPSBudWxsXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCBmYWxzZSlcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSgoeyBpdGVtOiBwYW5lSXRlbSB9KSA9PiB7XG4gICAgICAgIGlmIChwYW5lSXRlbSBpbnN0YW5jZW9mIFBhbmVsRG9jayAmJiAhdGhpcy5kZWFjdGl2YXRpbmcpIHtcbiAgICAgICAgICB0aGlzLnBhbmVsID0gbnVsbFxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgc2hvd1BhbmVsID0+IHtcbiAgICAgICAgdGhpcy5zaG93UGFuZWxDb25maWcgPSBzaG93UGFuZWxcbiAgICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICAgIH0pLFxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gISF0aGlzLmRlbGVnYXRlLmZpbHRlcmVkTWVzc2FnZXMubGVuZ3RoXG4gICAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgICB9KSxcbiAgICApXG4gICAgdGhpcy5hY3RpdmF0aW9uVGltZXIgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjaygoKSA9PiB7XG4gICAgICBsZXQgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgICAgIGNvbnN0IGRvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrKClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGRvY2sub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnBhbmVsIHx8IHRoaXMuZ2V0UGFuZWxMb2NhdGlvbigpICE9PSAnYm90dG9tJykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGlzRm9jdXNJbiA9IHBhbmVJdGVtID09PSB0aGlzLnBhbmVsXG4gICAgICAgICAgY29uc3QgZXh0ZXJuYWxseVRvZ2dsZWQgPSBpc0ZvY3VzSW4gIT09IHRoaXMuc2hvd1BhbmVsQ29uZmlnXG4gICAgICAgICAgaWYgKGV4dGVybmFsbHlUb2dnbGVkKSB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsICF0aGlzLnNob3dQYW5lbENvbmZpZylcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgZG9jay5vbkRpZENoYW5nZVZpc2libGUodmlzaWJsZSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnBhbmVsIHx8IHRoaXMuZ2V0UGFuZWxMb2NhdGlvbigpICE9PSAnYm90dG9tJykge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghdmlzaWJsZSkge1xuICAgICAgICAgICAgLy8gXiBXaGVuIGl0J3MgdGltZSB0byB0ZWxsIGNvbmZpZyB0byBoaWRlXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93UGFuZWxDb25maWcgJiYgdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgJiYgIXRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcykge1xuICAgICAgICAgICAgICAvLyBJZ25vcmUgYmVjYXVzZSB3ZSBqdXN0IGRvbid0IGhhdmUgYW55IG1lc3NhZ2VzIHRvIHNob3csIGV2ZXJ5dGhpbmcgZWxzZSBpcyBmaW5lXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBleHRlcm5hbGx5VG9nZ2xlZCA9IHZpc2libGUgIT09IHRoaXMuc2hvd1BhbmVsQ29uZmlnXG4gICAgICAgICAgaWYgKGV4dGVybmFsbHlUb2dnbGVkKSB7XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsICF0aGlzLnNob3dQYW5lbENvbmZpZylcbiAgICAgICAgICB9XG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICB0aGlzLmFjdGl2YXRlKClcbiAgICB9KVxuICB9XG4gIGdldFBhbmVsTG9jYXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLnBhbmVsKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcy5wYW5lbClcbiAgICByZXR1cm4gKHBhbmVDb250YWluZXIgJiYgcGFuZUNvbnRhaW5lci5sb2NhdGlvbikgfHwgbnVsbFxuICB9XG4gIGFzeW5jIGFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5wYW5lbCA9IG5ldyBQYW5lbERvY2sodGhpcy5kZWxlZ2F0ZSlcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHRoaXMucGFuZWwsIHtcbiAgICAgIGFjdGl2YXRlUGFuZTogZmFsc2UsXG4gICAgICBhY3RpdmF0ZUl0ZW06IGZhbHNlLFxuICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWUsXG4gICAgfSlcbiAgICB0aGlzLnVwZGF0ZSgpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgfVxuICB1cGRhdGUobmV3TWVzc2FnZXM6ID9BcnJheTxMaW50ZXJNZXNzYWdlPiA9IG51bGwpOiB2b2lkIHtcbiAgICBpZiAobmV3TWVzc2FnZXMpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBuZXdNZXNzYWdlc1xuICAgIH1cbiAgICB0aGlzLmRlbGVnYXRlLnVwZGF0ZSh0aGlzLm1lc3NhZ2VzKVxuICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9ICEhdGhpcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aFxuICAgIHRoaXMucmVmcmVzaCgpXG4gIH1cbiAgYXN5bmMgcmVmcmVzaCgpIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMucGFuZWxcbiAgICBpZiAocGFuZWwgPT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnNob3dQYW5lbENvbmZpZykge1xuICAgICAgICBhd2FpdCB0aGlzLmFjdGl2YXRlKClcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0ocGFuZWwpXG4gICAgaWYgKCFwYW5lQ29udGFpbmVyIHx8IHBhbmVDb250YWluZXIubG9jYXRpb24gIT09ICdib3R0b20nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgaXNBY3RpdmVQYW5lbCA9IHBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZUl0ZW0oKSA9PT0gcGFuZWxcbiAgICBjb25zdCB2aXNpYmlsaXR5QWxsb3dlZDEgPSB0aGlzLnNob3dQYW5lbENvbmZpZ1xuICAgIGNvbnN0IHZpc2liaWxpdHlBbGxvd2VkMiA9IHRoaXMuaGlkZVBhbmVsV2hlbkVtcHR5ID8gdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzIDogdHJ1ZVxuICAgIGlmICh2aXNpYmlsaXR5QWxsb3dlZDEgJiYgdmlzaWJpbGl0eUFsbG93ZWQyKSB7XG4gICAgICBpZiAoIWlzQWN0aXZlUGFuZWwpIHtcbiAgICAgICAgcGFuZUNvbnRhaW5lci5wYW5lRm9ySXRlbShwYW5lbCkuYWN0aXZhdGVJdGVtKHBhbmVsKVxuICAgICAgfVxuICAgICAgcGFuZUNvbnRhaW5lci5zaG93KClcbiAgICAgIHBhbmVsLmRvUGFuZWxSZXNpemUoKVxuICAgIH0gZWxzZSBpZiAoaXNBY3RpdmVQYW5lbCkge1xuICAgICAgcGFuZUNvbnRhaW5lci5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGluZyA9IHRydWVcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2sodGhpcy5hY3RpdmF0aW9uVGltZXIpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbFxuIl19