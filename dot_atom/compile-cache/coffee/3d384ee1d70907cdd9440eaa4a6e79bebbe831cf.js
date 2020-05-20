(function() {
  var MinimapSelectionView;

  MinimapSelectionView = require('./minimap-selection-view');

  module.exports = {
    active: false,
    views: {},
    config: {
      highlightCursorsLines: {
        type: 'boolean',
        "default": false,
        description: 'When true, the lines with cursors are highlighted in the minimap.'
      },
      outlineSelection: {
        type: 'boolean',
        "default": false,
        description: 'When true, the selections will also be rendered with outline decorations.'
      }
    },
    activate: function() {},
    consumeMinimapServiceV1: function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('selection', this);
    },
    deactivate: function() {
      this.minimap.unregisterPlugin('selection');
      return this.minimap = null;
    },
    isActive: function() {
      return this.active;
    },
    activatePlugin: function() {
      if (this.active) {
        return;
      }
      this.active = true;
      return this.subscription = this.minimap.observeMinimaps((function(_this) {
        return function(o) {
          var disposable, minimap, ref, selectionView;
          minimap = (ref = o.view) != null ? ref : o;
          selectionView = new MinimapSelectionView(minimap);
          _this.views[minimap.id] = selectionView;
          return disposable = minimap.onDidDestroy(function() {
            selectionView.destroy();
            delete _this.views[minimap.id];
            return disposable.dispose();
          });
        };
      })(this));
    },
    deactivatePlugin: function() {
      var id, ref, view;
      if (!this.active) {
        return;
      }
      ref = this.views;
      for (id in ref) {
        view = ref[id];
        view.destroy();
      }
      this.active = false;
      this.views = {};
      return this.subscription.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtc2VsZWN0aW9uL2xpYi9taW5pbWFwLXNlbGVjdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSwwQkFBUjs7RUFFdkIsTUFBTSxDQUFDLE9BQVAsR0FFRTtJQUFBLE1BQUEsRUFBUSxLQUFSO0lBQ0EsS0FBQSxFQUFPLEVBRFA7SUFHQSxNQUFBLEVBQ0U7TUFBQSxxQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsbUVBRmI7T0FERjtNQUlBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSwyRUFGYjtPQUxGO0tBSkY7SUFhQSxRQUFBLEVBQVUsU0FBQSxHQUFBLENBYlY7SUFlQSx1QkFBQSxFQUF5QixTQUFDLFFBQUQ7TUFBQyxJQUFDLENBQUEsVUFBRDthQUN4QixJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsSUFBckM7SUFEdUIsQ0FmekI7SUFrQkEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLFdBQTFCO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUZELENBbEJaO0lBc0JBLFFBQUEsRUFBVSxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0F0QlY7SUF3QkEsY0FBQSxFQUFnQixTQUFBO01BQ2QsSUFBVSxJQUFDLENBQUEsTUFBWDtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVTthQUVWLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxDQUF5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtBQUN2QyxjQUFBO1VBQUEsT0FBQSxrQ0FBbUI7VUFDbkIsYUFBQSxHQUFnQixJQUFJLG9CQUFKLENBQXlCLE9BQXpCO1VBRWhCLEtBQUMsQ0FBQSxLQUFNLENBQUEsT0FBTyxDQUFDLEVBQVIsQ0FBUCxHQUFxQjtpQkFFckIsVUFBQSxHQUFhLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFNBQUE7WUFDaEMsYUFBYSxDQUFDLE9BQWQsQ0FBQTtZQUNBLE9BQU8sS0FBQyxDQUFBLEtBQU0sQ0FBQSxPQUFPLENBQUMsRUFBUjttQkFDZCxVQUFVLENBQUMsT0FBWCxDQUFBO1VBSGdDLENBQXJCO1FBTjBCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QjtJQUpGLENBeEJoQjtJQXVDQSxnQkFBQSxFQUFrQixTQUFBO0FBQ2hCLFVBQUE7TUFBQSxJQUFBLENBQWMsSUFBQyxDQUFBLE1BQWY7QUFBQSxlQUFBOztBQUNBO0FBQUEsV0FBQSxTQUFBOztRQUFBLElBQUksQ0FBQyxPQUFMLENBQUE7QUFBQTtNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsS0FBRCxHQUFTO2FBRVQsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUE7SUFOZ0IsQ0F2Q2xCOztBQUpGIiwic291cmNlc0NvbnRlbnQiOlsiTWluaW1hcFNlbGVjdGlvblZpZXcgPSByZXF1aXJlICcuL21pbmltYXAtc2VsZWN0aW9uLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBhY3RpdmU6IGZhbHNlXG4gIHZpZXdzOiB7fVxuXG4gIGNvbmZpZzpcbiAgICBoaWdobGlnaHRDdXJzb3JzTGluZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZW4gdHJ1ZSwgdGhlIGxpbmVzIHdpdGggY3Vyc29ycyBhcmUgaGlnaGxpZ2h0ZWQgaW4gdGhlIG1pbmltYXAuJ1xuICAgIG91dGxpbmVTZWxlY3Rpb246XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogJ1doZW4gdHJ1ZSwgdGhlIHNlbGVjdGlvbnMgd2lsbCBhbHNvIGJlIHJlbmRlcmVkIHdpdGggb3V0bGluZSBkZWNvcmF0aW9ucy4nXG5cbiAgYWN0aXZhdGU6IC0+XG5cbiAgY29uc3VtZU1pbmltYXBTZXJ2aWNlVjE6IChAbWluaW1hcCkgLT5cbiAgICBAbWluaW1hcC5yZWdpc3RlclBsdWdpbiAnc2VsZWN0aW9uJywgdGhpc1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQG1pbmltYXAudW5yZWdpc3RlclBsdWdpbiAnc2VsZWN0aW9uJ1xuICAgIEBtaW5pbWFwID0gbnVsbFxuXG4gIGlzQWN0aXZlOiAtPiBAYWN0aXZlXG5cbiAgYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIGlmIEBhY3RpdmVcbiAgICBAYWN0aXZlID0gdHJ1ZVxuXG4gICAgQHN1YnNjcmlwdGlvbiA9IEBtaW5pbWFwLm9ic2VydmVNaW5pbWFwcyAobykgPT5cbiAgICAgIG1pbmltYXAgPSBvLnZpZXcgPyBvXG4gICAgICBzZWxlY3Rpb25WaWV3ID0gbmV3IE1pbmltYXBTZWxlY3Rpb25WaWV3KG1pbmltYXApXG5cbiAgICAgIEB2aWV3c1ttaW5pbWFwLmlkXSA9IHNlbGVjdGlvblZpZXdcblxuICAgICAgZGlzcG9zYWJsZSA9IG1pbmltYXAub25EaWREZXN0cm95ID0+XG4gICAgICAgIHNlbGVjdGlvblZpZXcuZGVzdHJveSgpXG4gICAgICAgIGRlbGV0ZSBAdmlld3NbbWluaW1hcC5pZF1cbiAgICAgICAgZGlzcG9zYWJsZS5kaXNwb3NlKClcblxuICBkZWFjdGl2YXRlUGx1Z2luOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVxuICAgIHZpZXcuZGVzdHJveSgpIGZvciBpZCx2aWV3IG9mIEB2aWV3c1xuICAgIEBhY3RpdmUgPSBmYWxzZVxuICAgIEB2aWV3cyA9IHt9XG5cbiAgICBAc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuIl19
