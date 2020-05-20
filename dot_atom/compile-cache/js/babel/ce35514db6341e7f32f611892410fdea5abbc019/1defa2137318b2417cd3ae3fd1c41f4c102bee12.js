var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var Intentions = (function () {
  function Intentions() {
    _classCallCheck(this, Intentions);

    this.messages = [];
    this.grammarScopes = ['*'];
  }

  _createClass(Intentions, [{
    key: 'getIntentions',
    value: function getIntentions(_ref) {
      var textEditor = _ref.textEditor;
      var bufferPosition = _ref.bufferPosition;

      var intentions = [];
      var messages = (0, _helpers.filterMessages)(this.messages, textEditor.getPath());

      var _loop = function (message) {
        var hasFixes = message.solutions && message.solutions.length;
        if (!hasFixes) {
          return 'continue';
        }
        var range = (0, _helpers.$range)(message);
        var inRange = range && range.containsPoint(bufferPosition);
        if (!inRange) {
          return 'continue';
        }

        var solutions = [];
        if (message.version === 2 && message.solutions && message.solutions.length) {
          solutions = message.solutions;
        }
        var linterName = message.linterName || 'Linter';

        intentions = intentions.concat(solutions.map(function (solution) {
          return {
            priority: solution.priority ? solution.priority + 200 : 200,
            icon: 'tools',
            title: solution.title || 'Fix ' + linterName + ' issue',
            selected: function selected() {
              (0, _helpers.applySolution)(textEditor, solution);
            }
          };
        }));
      };

      for (var message of messages) {
        var _ret = _loop(message);

        if (_ret === 'continue') continue;
      }
      return intentions;
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }]);

  return Intentions;
})();

module.exports = Intentions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW50ZW50aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3VCQUVzRCxXQUFXOztJQUczRCxVQUFVO0FBSUgsV0FKUCxVQUFVLEdBSUE7MEJBSlYsVUFBVTs7QUFLWixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7R0FDM0I7O2VBUEcsVUFBVTs7V0FRRCx1QkFBQyxJQUFzQyxFQUFpQjtVQUFyRCxVQUFVLEdBQVosSUFBc0MsQ0FBcEMsVUFBVTtVQUFFLGNBQWMsR0FBNUIsSUFBc0MsQ0FBeEIsY0FBYzs7QUFDeEMsVUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQU0sUUFBUSxHQUFHLDZCQUFlLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7OzRCQUV6RCxPQUFPO0FBQ2hCLFlBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUE7QUFDOUQsWUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLDRCQUFRO1NBQ1Q7QUFDRCxZQUFNLEtBQUssR0FBRyxxQkFBTyxPQUFPLENBQUMsQ0FBQTtBQUM3QixZQUFNLE9BQU8sR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUM1RCxZQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osNEJBQVE7U0FDVDs7QUFFRCxZQUFJLFNBQXdCLEdBQUcsRUFBRSxDQUFBO0FBQ2pDLFlBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUMxRSxtQkFBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUE7U0FDOUI7QUFDRCxZQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQTs7QUFFakQsa0JBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUM1QixTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTtpQkFBSztBQUN6QixvQkFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsR0FBRztBQUMzRCxnQkFBSSxFQUFFLE9BQU87QUFDYixpQkFBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLGFBQVcsVUFBVSxXQUFRO0FBQ2xELG9CQUFRLEVBQUEsb0JBQUc7QUFDVCwwQ0FBYyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUE7YUFDcEM7V0FDRjtTQUFDLENBQUMsQ0FDSixDQUFBOzs7QUExQkgsV0FBSyxJQUFNLE9BQU8sSUFBSSxRQUFRLEVBQUU7eUJBQXJCLE9BQU87O2lDQVFkLFNBQVE7T0FtQlg7QUFDRCxhQUFPLFVBQVUsQ0FBQTtLQUNsQjs7O1dBQ0ssZ0JBQUMsUUFBOEIsRUFBRTtBQUNyQyxVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtLQUN6Qjs7O1NBNUNHLFVBQVU7OztBQStDaEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUEiLCJmaWxlIjoiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9pbnRlbnRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgJHJhbmdlLCBhcHBseVNvbHV0aW9uLCBmaWx0ZXJNZXNzYWdlcyB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIEludGVudGlvbnMge1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT5cbiAgZ3JhbW1hclNjb3BlczogQXJyYXk8c3RyaW5nPlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZ3JhbW1hclNjb3BlcyA9IFsnKiddXG4gIH1cbiAgZ2V0SW50ZW50aW9ucyh7IHRleHRFZGl0b3IsIGJ1ZmZlclBvc2l0aW9uIH06IE9iamVjdCk6IEFycmF5PE9iamVjdD4ge1xuICAgIGxldCBpbnRlbnRpb25zID0gW11cbiAgICBjb25zdCBtZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzKHRoaXMubWVzc2FnZXMsIHRleHRFZGl0b3IuZ2V0UGF0aCgpKVxuXG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICBjb25zdCBoYXNGaXhlcyA9IG1lc3NhZ2Uuc29sdXRpb25zICYmIG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aFxuICAgICAgaWYgKCFoYXNGaXhlcykge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICAgIGNvbnN0IGluUmFuZ2UgPSByYW5nZSAmJiByYW5nZS5jb250YWluc1BvaW50KGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgaWYgKCFpblJhbmdlKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBzb2x1dGlvbnM6IEFycmF5PE9iamVjdD4gPSBbXVxuICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMiAmJiBtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgc29sdXRpb25zID0gbWVzc2FnZS5zb2x1dGlvbnNcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxpbnRlck5hbWUgPSBtZXNzYWdlLmxpbnRlck5hbWUgfHwgJ0xpbnRlcidcblxuICAgICAgaW50ZW50aW9ucyA9IGludGVudGlvbnMuY29uY2F0KFxuICAgICAgICBzb2x1dGlvbnMubWFwKHNvbHV0aW9uID0+ICh7XG4gICAgICAgICAgcHJpb3JpdHk6IHNvbHV0aW9uLnByaW9yaXR5ID8gc29sdXRpb24ucHJpb3JpdHkgKyAyMDAgOiAyMDAsXG4gICAgICAgICAgaWNvbjogJ3Rvb2xzJyxcbiAgICAgICAgICB0aXRsZTogc29sdXRpb24udGl0bGUgfHwgYEZpeCAke2xpbnRlck5hbWV9IGlzc3VlYCxcbiAgICAgICAgICBzZWxlY3RlZCgpIHtcbiAgICAgICAgICAgIGFwcGx5U29sdXRpb24odGV4dEVkaXRvciwgc29sdXRpb24pXG4gICAgICAgICAgfSxcbiAgICAgICAgfSkpLFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gaW50ZW50aW9uc1xuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVudGlvbnNcbiJdfQ==