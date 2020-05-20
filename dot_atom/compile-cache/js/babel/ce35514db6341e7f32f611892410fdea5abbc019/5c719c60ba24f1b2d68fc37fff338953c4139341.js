var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sbReactTable = require('sb-react-table');

var _sbReactTable2 = _interopRequireDefault(_sbReactTable);

var _helpers = require('../helpers');

var PanelComponent = (function (_React$Component) {
  _inherits(PanelComponent, _React$Component);

  _createClass(PanelComponent, null, [{
    key: 'renderRowColumn',
    value: function renderRowColumn(row, column) {
      var range = (0, _helpers.$range)(row);

      switch (column) {
        case 'file':
          return (0, _helpers.getPathOfMessage)(row);
        case 'line':
          return range ? range.start.row + 1 + ':' + (range.start.column + 1) : '';
        case 'excerpt':
          return row.excerpt;
        case 'severity':
          return _helpers.severityNames[row.severity];
        default:
          return row[column];
      }
    }
  }]);

  function PanelComponent(props, context) {
    _classCallCheck(this, PanelComponent);

    _get(Object.getPrototypeOf(PanelComponent.prototype), 'constructor', this).call(this, props, context);

    this.onClick = function (e, row) {
      if (e.target.tagName === 'A') {
        return;
      }
      if (process.platform === 'darwin' ? e.metaKey : e.ctrlKey) {
        if (e.shiftKey) {
          (0, _helpers.openExternally)(row);
        } else {
          (0, _helpers.visitMessage)(row, true);
        }
      } else {
        (0, _helpers.visitMessage)(row);
      }
    };

    this.state = {
      messages: this.props.delegate.filteredMessages
    };
  }

  _createClass(PanelComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onDidChangeMessages(function (messages) {
        _this.setState({ messages: messages });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var delegate = this.props.delegate;

      var columns = [{ key: 'severity', label: 'Severity', sortable: true }, { key: 'linterName', label: 'Provider', sortable: true }, { key: 'excerpt', label: 'Description', onClick: this.onClick }, { key: 'line', label: 'Line', sortable: true, onClick: this.onClick }];
      if (delegate.panelRepresents === 'Entire Project') {
        columns.push({
          key: 'file',
          label: 'File',
          sortable: true,
          onClick: this.onClick
        });
      }

      var customStyle = { overflowY: 'scroll', height: '100%' };

      return _react2['default'].createElement(
        'div',
        { id: 'linter-panel', tabIndex: '-1', style: customStyle },
        _react2['default'].createElement(_sbReactTable2['default'], {
          rows: this.state.messages,
          columns: columns,
          initialSort: [{ column: 'severity', type: 'desc' }, { column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }],
          sort: _helpers.sortMessages,
          rowKey: function (i) {
            return i.key;
          },
          renderHeaderColumn: function (i) {
            return i.label;
          },
          renderBodyColumn: PanelComponent.renderRowColumn,
          style: { width: '100%' },
          className: 'linter'
        })
      );
    }
  }]);

  return PanelComponent;
})(_react2['default'].Component);

module.exports = PanelComponent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JhYnlqZXN1cy8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7NEJBQ0YsZ0JBQWdCOzs7O3VCQUM2RCxZQUFZOztJQVkxRyxjQUFjO1lBQWQsY0FBYzs7ZUFBZCxjQUFjOztXQUNJLHlCQUFDLEdBQWtCLEVBQUUsTUFBYyxFQUFtQjtBQUMxRSxVQUFNLEtBQUssR0FBRyxxQkFBTyxHQUFHLENBQUMsQ0FBQTs7QUFFekIsY0FBUSxNQUFNO0FBQ1osYUFBSyxNQUFNO0FBQ1QsaUJBQU8sK0JBQWlCLEdBQUcsQ0FBQyxDQUFBO0FBQUEsQUFDOUIsYUFBSyxNQUFNO0FBQ1QsaUJBQU8sS0FBSyxHQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsR0FBSyxFQUFFLENBQUE7QUFBQSxBQUN4RSxhQUFLLFNBQVM7QUFDWixpQkFBTyxHQUFHLENBQUMsT0FBTyxDQUFBO0FBQUEsQUFDcEIsYUFBSyxVQUFVO0FBQ2IsaUJBQU8sdUJBQWMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQUEsQUFDcEM7QUFDRSxpQkFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFBQSxPQUNyQjtLQUNGOzs7QUFFVSxXQWxCUCxjQUFjLENBa0JOLEtBQWEsRUFBRSxPQUFnQixFQUFFOzBCQWxCekMsY0FBYzs7QUFtQmhCLCtCQW5CRSxjQUFjLDZDQW1CVixLQUFLLEVBQUUsT0FBTyxFQUFDOztTQWF2QixPQUFPLEdBQUcsVUFBQyxDQUFDLEVBQWMsR0FBRyxFQUFvQjtBQUMvQyxVQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRTtBQUM1QixlQUFNO09BQ1A7QUFDRCxVQUFJLE9BQU8sQ0FBQyxR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Q0FBQSIsImZpbGUiOiIvaG9tZS9iYWJ5amVzdXMvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdFRhYmxlIGZyb20gJ3NiLXJlYWN0LXRhYmxlJ1xuaW1wb3J0IHsgJHJhbmdlLCBzZXZlcml0eU5hbWVzLCBzb3J0TWVzc2FnZXMsIHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHksIGdldFBhdGhPZk1lc3NhZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG50eXBlIFByb3BzID0ge1xuICBkZWxlZ2F0ZTogRGVsZWdhdGUsXG59XG5cbnR5cGUgU3RhdGUgPSB7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPixcbn1cblxuY2xhc3MgUGFuZWxDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHMsIFN0YXRlPiB7XG4gIHN0YXRpYyByZW5kZXJSb3dDb2x1bW4ocm93OiBMaW50ZXJNZXNzYWdlLCBjb2x1bW46IHN0cmluZyk6IHN0cmluZyB8IE9iamVjdCB7XG4gICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2Uocm93KVxuXG4gICAgc3dpdGNoIChjb2x1bW4pIHtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0UGF0aE9mTWVzc2FnZShyb3cpXG4gICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgcmV0dXJuIHJhbmdlID8gYCR7cmFuZ2Uuc3RhcnQucm93ICsgMX06JHtyYW5nZS5zdGFydC5jb2x1bW4gKyAxfWAgOiAnJ1xuICAgICAgY2FzZSAnZXhjZXJwdCc6XG4gICAgICAgIHJldHVybiByb3cuZXhjZXJwdFxuICAgICAgY2FzZSAnc2V2ZXJpdHknOlxuICAgICAgICByZXR1cm4gc2V2ZXJpdHlOYW1lc1tyb3cuc2V2ZXJpdHldXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcm93W2NvbHVtbl1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogT2JqZWN0LCBjb250ZXh0OiA/T2JqZWN0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lc3NhZ2VzOiB0aGlzLnByb3BzLmRlbGVnYXRlLmZpbHRlcmVkTWVzc2FnZXMsXG4gICAgfVxuICB9XG4gIHN0YXRlOiBTdGF0ZVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25EaWRDaGFuZ2VNZXNzYWdlcyhtZXNzYWdlcyA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbWVzc2FnZXMgfSlcbiAgICB9KVxuICB9XG5cbiAgb25DbGljayA9IChlOiBNb3VzZUV2ZW50LCByb3c6IExpbnRlck1lc3NhZ2UpID0+IHtcbiAgICBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ0EnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nID8gZS5tZXRhS2V5IDogZS5jdHJsS2V5KSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBvcGVuRXh0ZXJuYWxseShyb3cpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aXNpdE1lc3NhZ2Uocm93LCB0cnVlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpdE1lc3NhZ2Uocm93KVxuICAgIH1cbiAgfVxuXG4gIHByb3BzOiBQcm9wc1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgY29sdW1ucyA9IFtcbiAgICAgIHsga2V5OiAnc2V2ZXJpdHknLCBsYWJlbDogJ1NldmVyaXR5Jywgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHsga2V5OiAnbGludGVyTmFtZScsIGxhYmVsOiAnUHJvdmlkZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBrZXk6ICdleGNlcnB0JywgbGFiZWw6ICdEZXNjcmlwdGlvbicsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9LFxuICAgICAgeyBrZXk6ICdsaW5lJywgbGFiZWw6ICdMaW5lJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9LFxuICAgIF1cbiAgICBpZiAoZGVsZWdhdGUucGFuZWxSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICBjb2x1bW5zLnB1c2goe1xuICAgICAgICBrZXk6ICdmaWxlJyxcbiAgICAgICAgbGFiZWw6ICdGaWxlJyxcbiAgICAgICAgc29ydGFibGU6IHRydWUsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMub25DbGljayxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgY3VzdG9tU3R5bGU6IE9iamVjdCA9IHsgb3ZlcmZsb3dZOiAnc2Nyb2xsJywgaGVpZ2h0OiAnMTAwJScgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJsaW50ZXItcGFuZWxcIiB0YWJJbmRleD1cIi0xXCIgc3R5bGU9e2N1c3RvbVN0eWxlfT5cbiAgICAgICAgPFJlYWN0VGFibGVcbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLm1lc3NhZ2VzfVxuICAgICAgICAgIGNvbHVtbnM9e2NvbHVtbnN9XG4gICAgICAgICAgaW5pdGlhbFNvcnQ9e1tcbiAgICAgICAgICAgIHsgY29sdW1uOiAnc2V2ZXJpdHknLCB0eXBlOiAnZGVzYycgfSxcbiAgICAgICAgICAgIHsgY29sdW1uOiAnZmlsZScsIHR5cGU6ICdhc2MnIH0sXG4gICAgICAgICAgICB7IGNvbHVtbjogJ2xpbmUnLCB0eXBlOiAnYXNjJyB9LFxuICAgICAgICAgIF19XG4gICAgICAgICAgc29ydD17c29ydE1lc3NhZ2VzfVxuICAgICAgICAgIHJvd0tleT17aSA9PiBpLmtleX1cbiAgICAgICAgICByZW5kZXJIZWFkZXJDb2x1bW49e2kgPT4gaS5sYWJlbH1cbiAgICAgICAgICByZW5kZXJCb2R5Q29sdW1uPXtQYW5lbENvbXBvbmVudC5yZW5kZXJSb3dDb2x1bW59XG4gICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICAgIGNsYXNzTmFtZT1cImxpbnRlclwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbENvbXBvbmVudFxuIl19