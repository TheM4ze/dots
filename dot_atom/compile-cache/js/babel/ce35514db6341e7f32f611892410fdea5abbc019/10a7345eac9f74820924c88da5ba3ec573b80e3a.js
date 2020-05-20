Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var AtomClockView = (function () {
  function AtomClockView(statusBar) {
    _classCallCheck(this, AtomClockView);

    this.statusBar = statusBar;
    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(AtomClockView, [{
    key: 'start',
    value: function start() {
      this.drawElement();
      this.initialize();
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.setConfigValues();
      this.setTooltip(this.showTooltip);
      this.setIcon(this.showIcon);
      this.toClipboard(this.rightClickToClipboard);
      this.setUTCClass(this.showUTC);
      this.startTicker();

      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-clock:toggle': function atomClockToggle() {
          return _this.toggle();
        },
        'atom-clock:utc-mode': function atomClockUtcMode() {
          return atom.config.set('atom-clock.showUTC', !_this.showUTC);
        }
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.dateFormat', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showTooltip', function () {
        _this.setConfigValues();
        _this.setTooltip(_this.showTooltip);
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.tooltipDateFormat', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.locale', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showUTC', function () {
        _this.refreshTicker();
        _this.setUTCClass(_this.showUTC);
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.refreshInterval', function () {
        _this.refreshTicker();
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showClockIcon', function () {
        _this.setConfigValues();
        _this.setIcon(_this.showIcon);
      }));

      if (this.showOnlyInFullscreen) this.element.classList.add('fullscreen-hide');else this.element.classList.remove('fullscreen-hide');

      this.subscriptions.add(atom.config.onDidChange('atom-clock.showOnlyInFullscreen', function () {
        _this.showOnlyInFullscreen = !_this.showOnlyInFullscreen;
        _this.element.classList.toggle('fullscreen-hide');
      }));

      this.subscriptions.add(atom.config.onDidChange('atom-clock.rightClickToClipboard', function () {
        _this.rightClickToClipboard = !_this.rightClickToClipboard;
        _this.toClipboard(_this.rightClickToClipboard);
      }));
    }
  }, {
    key: 'drawElement',
    value: function drawElement() {
      this.element = document.createElement('div');
      this.element.classList.add('atom-clock', 'inline-block');

      this.iconElement = document.createElement('span');
      this.iconElement.classList.add('atom-clock-icon');

      this.timeElement = document.createElement('span');
      this.timeElement.classList.add('atom-clock-time');

      this.element.appendChild(this.iconElement);
      this.element.appendChild(this.timeElement);

      this.statusBar.addRightTile({
        item: this.element,
        priority: -500
      });
    }
  }, {
    key: 'setConfigValues',
    value: function setConfigValues() {
      this.dateFormat = atom.config.get('atom-clock.dateFormat');
      this.showTooltip = atom.config.get('atom-clock.showTooltip');
      this.tooltipDateFormat = atom.config.get('atom-clock.tooltipDateFormat');
      this.locale = atom.config.get('atom-clock.locale');
      this.showUTC = atom.config.get('atom-clock.showUTC');
      this.refreshInterval = atom.config.get('atom-clock.refreshInterval') * 1000;
      this.showIcon = atom.config.get('atom-clock.showClockIcon');
      this.showOnlyInFullscreen = atom.config.get('atom-clock.showOnlyInFullscreen');
      this.rightClickToClipboard = atom.config.get('atom-clock.rightClickToClipboard');
    }
  }, {
    key: 'startTicker',
    value: function startTicker() {
      var _this2 = this;

      this.setDate();
      var nextTick = this.refreshInterval - Date.now() % this.refreshInterval;
      this.tick = setTimeout(function () {
        _this2.startTicker();
      }, nextTick);
    }
  }, {
    key: 'clearTicker',
    value: function clearTicker() {
      if (this.tick) clearTimeout(this.tick);
    }
  }, {
    key: 'refreshTicker',
    value: function refreshTicker() {
      this.setConfigValues();
      this.clearTicker();
      this.startTicker();
    }
  }, {
    key: 'setDate',
    value: function setDate() {
      this.date = this.getDate(this.locale, this.dateFormat);
      this.timeElement.textContent = this.date;
    }
  }, {
    key: 'getDate',
    value: function getDate(locale, format) {
      if (!this.Moment) this.Moment = require('moment');

      var moment = this.Moment().locale(locale);

      if (this.showUTC) moment.utc();

      return moment.format(format);
    }
  }, {
    key: 'setIcon',
    value: function setIcon(toSet) {
      if (toSet) this.iconElement.classList.add('icon', 'icon-clock');else this.iconElement.classList.remove('icon', 'icon-clock');
    }
  }, {
    key: 'setTooltip',
    value: function setTooltip(toSet) {
      var _this3 = this;

      if (this.tooltip === undefined) this.tooltip = atom.tooltips.add(this.element, {
        title: function title() {
          return _this3.getDate(_this3.locale, _this3.tooltipDateFormat);
        },
        'class': 'atom-clock-tooltip'
      });

      if (toSet) atom.tooltips.findTooltips(this.element)[0].enable();else atom.tooltips.findTooltips(this.element)[0].disable();
    }
  }, {
    key: 'toClipboard',
    value: function toClipboard(toSet) {
      var _this4 = this;

      if (toSet) {
        this.element.oncontextmenu = function () {
          atom.clipboard.write(_this4.getDate(_this4.locale, _this4.tooltipDateFormat));
          atom.notifications.addSuccess('Current time copied to clipboard.', {
            dismissable: true,
            icon: 'clock'
          });
        };
      } else {
        this.element.oncontextmenu = null;
      }
    }
  }, {
    key: 'setUTCClass',
    value: function setUTCClass(toSet) {
      if (toSet) {
        this.element.classList.add('atom-clock-utc');
        atom.tooltips.findTooltips(this.element)[0].getTooltipElement().classList.add('atom-clock-utc');
      } else {
        this.element.classList.remove('atom-clock-utc');
        atom.tooltips.findTooltips(this.element)[0].getTooltipElement().classList.remove('atom-clock-utc');
      }
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var style = this.element.style.display;
      this.element.style.display = style === 'none' ? '' : 'none';
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.clearTicker();
      this.subscriptions.dispose();
      this.tooltip.dispose();
      this.element.remove();
    }
  }]);

  return AtomClockView;
})();

exports['default'] = AtomClockView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9hdG9tLWNsb2NrL2xpYi9hdG9tLWNsb2NrLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O0FBRjFDLFdBQVcsQ0FBQzs7SUFJUyxhQUFhO0FBRXJCLFdBRlEsYUFBYSxDQUVwQixTQUFTLEVBQUU7MEJBRkosYUFBYTs7QUFHOUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtHQUMvQzs7ZUFMa0IsYUFBYTs7V0FPM0IsaUJBQUc7QUFDTixVQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDbEIsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ2xCOzs7V0FFUyxzQkFBRzs7O0FBQ1gsVUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2pDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzNCLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDNUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDOUIsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBOztBQUVsQixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCwyQkFBbUIsRUFBRTtpQkFBTSxNQUFLLE1BQU0sRUFBRTtTQUFBO0FBQ3hDLDZCQUFxQixFQUFFO2lCQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBSyxPQUFPLENBQUM7U0FBQTtPQUNsRixDQUFDLENBQUMsQ0FBQTs7QUFF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QUFBO0tBQzVEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNsQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtLQUN0Qjs7O1NBak1rQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvaG9tZS9iYWJ5amVzdXMvLmF0b20vcGFja2FnZXMvYXRvbS1jbG9jay9saWIvYXRvbS1jbG9jay12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdG9tQ2xvY2tWaWV3IHtcblxuICBjb25zdHJ1Y3RvcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuZHJhd0VsZW1lbnQoKVxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpXG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuc2V0Q29uZmlnVmFsdWVzKClcbiAgICB0aGlzLnNldFRvb2x0aXAodGhpcy5zaG93VG9vbHRpcClcbiAgICB0aGlzLnNldEljb24odGhpcy5zaG93SWNvbilcbiAgICB0aGlzLnRvQ2xpcGJvYXJkKHRoaXMucmlnaHRDbGlja1RvQ2xpcGJvYXJkKVxuICAgIHRoaXMuc2V0VVRDQ2xhc3ModGhpcy5zaG93VVRDKVxuICAgIHRoaXMuc3RhcnRUaWNrZXIoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAnYXRvbS1jbG9jazp0b2dnbGUnOiAoKSA9PiB0aGlzLnRvZ2dsZSgpLFxuICAgICAgJ2F0b20tY2xvY2s6dXRjLW1vZGUnOiAoKSA9PiBhdG9tLmNvbmZpZy5zZXQoJ2F0b20tY2xvY2suc2hvd1VUQycsICF0aGlzLnNob3dVVEMpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLmRhdGVGb3JtYXQnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay5zaG93VG9vbHRpcCcsICgpID0+IHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnVmFsdWVzKClcbiAgICAgIHRoaXMuc2V0VG9vbHRpcCh0aGlzLnNob3dUb29sdGlwKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnYXRvbS1jbG9jay50b29sdGlwRGF0ZUZvcm1hdCcsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFRpY2tlcigpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLmxvY2FsZScsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFRpY2tlcigpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLnNob3dVVEMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlZnJlc2hUaWNrZXIoKVxuICAgICAgdGhpcy5zZXRVVENDbGFzcyh0aGlzLnNob3dVVEMpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLnJlZnJlc2hJbnRlcnZhbCcsICgpID0+IHtcbiAgICAgIHRoaXMucmVmcmVzaFRpY2tlcigpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLnNob3dDbG9ja0ljb24nLCAoKSA9PiB7XG4gICAgICB0aGlzLnNldENvbmZpZ1ZhbHVlcygpXG4gICAgICB0aGlzLnNldEljb24odGhpcy5zaG93SWNvbilcbiAgICB9KSlcblxuICAgIGlmICh0aGlzLnNob3dPbmx5SW5GdWxsc2NyZWVuKVxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4taGlkZScpXG4gICAgZWxzZVxuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGxzY3JlZW4taGlkZScpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdG9tLWNsb2NrLnNob3dPbmx5SW5GdWxsc2NyZWVuJywgKCkgPT4ge1xuICAgICAgdGhpcy5zaG93T25seUluRnVsbHNjcmVlbiA9ICF0aGlzLnNob3dPbmx5SW5GdWxsc2NyZWVuXG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZnVsbHNjcmVlbi1oaWRlJylcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F0b20tY2xvY2sucmlnaHRDbGlja1RvQ2xpcGJvYXJkJywgKCkgPT4ge1xuICAgICAgdGhpcy5yaWdodENsaWNrVG9DbGlwYm9hcmQgPSAhdGhpcy5yaWdodENsaWNrVG9DbGlwYm9hcmRcbiAgICAgIHRoaXMudG9DbGlwYm9hcmQodGhpcy5yaWdodENsaWNrVG9DbGlwYm9hcmQpXG4gICAgfSkpXG5cbiAgfVxuXG4gIGRyYXdFbGVtZW50KCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2F0b20tY2xvY2snLCAnaW5saW5lLWJsb2NrJylcblxuICAgIHRoaXMuaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLmljb25FbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2F0b20tY2xvY2staWNvbicpXG5cbiAgICB0aGlzLnRpbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy50aW1lRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhdG9tLWNsb2NrLXRpbWUnKVxuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaWNvbkVsZW1lbnQpXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGltZUVsZW1lbnQpXG5cbiAgICB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50LFxuICAgICAgcHJpb3JpdHk6IC01MDBcbiAgICB9KVxuICB9XG5cbiAgc2V0Q29uZmlnVmFsdWVzKCkge1xuICAgIHRoaXMuZGF0ZUZvcm1hdCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5kYXRlRm9ybWF0JylcbiAgICB0aGlzLnNob3dUb29sdGlwID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnNob3dUb29sdGlwJylcbiAgICB0aGlzLnRvb2x0aXBEYXRlRm9ybWF0ID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnRvb2x0aXBEYXRlRm9ybWF0JylcbiAgICB0aGlzLmxvY2FsZSA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5sb2NhbGUnKVxuICAgIHRoaXMuc2hvd1VUQyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5zaG93VVRDJylcbiAgICB0aGlzLnJlZnJlc2hJbnRlcnZhbCA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1jbG9jay5yZWZyZXNoSW50ZXJ2YWwnKSAqIDEwMDBcbiAgICB0aGlzLnNob3dJY29uID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnNob3dDbG9ja0ljb24nKVxuICAgIHRoaXMuc2hvd09ubHlJbkZ1bGxzY3JlZW4gPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY2xvY2suc2hvd09ubHlJbkZ1bGxzY3JlZW4nKVxuICAgIHRoaXMucmlnaHRDbGlja1RvQ2xpcGJvYXJkID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNsb2NrLnJpZ2h0Q2xpY2tUb0NsaXBib2FyZCcpXG4gIH1cblxuICBzdGFydFRpY2tlcigpIHtcbiAgICB0aGlzLnNldERhdGUoKVxuICAgIHZhciBuZXh0VGljayA9IHRoaXMucmVmcmVzaEludGVydmFsIC0gKERhdGUubm93KCkgJSB0aGlzLnJlZnJlc2hJbnRlcnZhbClcbiAgICB0aGlzLnRpY2sgPSBzZXRUaW1lb3V0ICgoKSA9PiAgeyB0aGlzLnN0YXJ0VGlja2VyKCkgfSwgbmV4dFRpY2spXG4gIH1cblxuICBjbGVhclRpY2tlcigpIHtcbiAgICBpZiAodGhpcy50aWNrKVxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGljaylcbiAgfVxuXG4gIHJlZnJlc2hUaWNrZXIoKSB7XG4gICAgdGhpcy5zZXRDb25maWdWYWx1ZXMoKVxuICAgIHRoaXMuY2xlYXJUaWNrZXIoKVxuICAgIHRoaXMuc3RhcnRUaWNrZXIoKVxuICB9XG5cbiAgc2V0RGF0ZSgpIHtcbiAgICB0aGlzLmRhdGUgPSB0aGlzLmdldERhdGUodGhpcy5sb2NhbGUsIHRoaXMuZGF0ZUZvcm1hdClcbiAgICB0aGlzLnRpbWVFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5kYXRlXG4gIH1cblxuICBnZXREYXRlKGxvY2FsZSwgZm9ybWF0KSB7XG4gICAgaWYgKCF0aGlzLk1vbWVudClcbiAgICAgIHRoaXMuTW9tZW50ID0gcmVxdWlyZSgnbW9tZW50JylcblxuICAgIHZhciBtb21lbnQgPSB0aGlzLk1vbWVudCgpLmxvY2FsZShsb2NhbGUpXG5cbiAgICBpZiAodGhpcy5zaG93VVRDKVxuICAgICAgbW9tZW50LnV0YygpXG5cbiAgICByZXR1cm4gbW9tZW50LmZvcm1hdChmb3JtYXQpXG4gIH1cblxuICBzZXRJY29uKHRvU2V0KSB7XG4gICAgaWYgKHRvU2V0KVxuICAgICAgdGhpcy5pY29uRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpY29uJywgJ2ljb24tY2xvY2snKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuaWNvbkVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaWNvbicsICdpY29uLWNsb2NrJylcbiAgfVxuXG4gIHNldFRvb2x0aXAodG9TZXQpIHtcbiAgICBpZiAodGhpcy50b29sdGlwID09PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLnRvb2x0aXAgPSBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgdGl0bGU6ICgpID0+IHRoaXMuZ2V0RGF0ZSh0aGlzLmxvY2FsZSwgdGhpcy50b29sdGlwRGF0ZUZvcm1hdCksXG4gICAgICAgIGNsYXNzOiAnYXRvbS1jbG9jay10b29sdGlwJ1xuICAgICAgfSlcblxuICAgIGlmICh0b1NldClcbiAgICAgIGF0b20udG9vbHRpcHMuZmluZFRvb2x0aXBzKHRoaXMuZWxlbWVudClbMF0uZW5hYmxlKClcbiAgICBlbHNlXG4gICAgICBhdG9tLnRvb2x0aXBzLmZpbmRUb29sdGlwcyh0aGlzLmVsZW1lbnQpWzBdLmRpc2FibGUoKVxuICB9XG5cbiAgdG9DbGlwYm9hcmQodG9TZXQpIHtcbiAgICBpZiAodG9TZXQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5vbmNvbnRleHRtZW51ID0gKCkgPT4ge1xuICAgICAgICBhdG9tLmNsaXBib2FyZC53cml0ZSh0aGlzLmdldERhdGUodGhpcy5sb2NhbGUsIHRoaXMudG9vbHRpcERhdGVGb3JtYXQpKVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcygnQ3VycmVudCB0aW1lIGNvcGllZCB0byBjbGlwYm9hcmQuJywge1xuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIGljb246ICdjbG9jaydcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbGVtZW50Lm9uY29udGV4dG1lbnUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgc2V0VVRDQ2xhc3ModG9TZXQpIHtcbiAgICBpZiAodG9TZXQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhdG9tLWNsb2NrLXV0YycpXG4gICAgICBhdG9tLnRvb2x0aXBzLmZpbmRUb29sdGlwcyh0aGlzLmVsZW1lbnQpWzBdLmdldFRvb2x0aXBFbGVtZW50KCkuY2xhc3NMaXN0LmFkZCgnYXRvbS1jbG9jay11dGMnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYXRvbS1jbG9jay11dGMnKVxuICAgICAgYXRvbS50b29sdGlwcy5maW5kVG9vbHRpcHModGhpcy5lbGVtZW50KVswXS5nZXRUb29sdGlwRWxlbWVudCgpLmNsYXNzTGlzdC5yZW1vdmUoJ2F0b20tY2xvY2stdXRjJylcbiAgICB9XG4gIH1cblxuXG4gIHRvZ2dsZSgpIHtcbiAgICB2YXIgc3R5bGUgPSB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheVxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gc3R5bGUgPT09ICdub25lJyA/ICcnIDogJ25vbmUnXG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY2xlYXJUaWNrZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnRvb2x0aXAuZGlzcG9zZSgpXG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpXG4gIH1cbn1cbiJdfQ==