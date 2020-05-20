(function() {
  var CompositeDisposable, MinimapSelectionView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = MinimapSelectionView = (function() {
    MinimapSelectionView.prototype.decorations = [];

    function MinimapSelectionView(minimap) {
      var editor;
      this.minimap = minimap;
      this.handleSelection = bind(this.handleSelection, this);
      editor = this.minimap.getTextEditor();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(editor.onDidAddCursor(this.handleSelection));
      this.subscriptions.add(editor.onDidChangeCursorPosition(this.handleSelection));
      this.subscriptions.add(editor.onDidRemoveCursor(this.handleSelection));
      this.subscriptions.add(atom.config.observe('minimap-selection.outlineSelection', this.handleSelection));
      this.handleSelection();
    }

    MinimapSelectionView.prototype.destroy = function() {
      this.removeDecorations();
      this.subscriptions.dispose();
      return this.minimap = null;
    };

    MinimapSelectionView.prototype.handleSelection = function() {
      var decoration, i, len, ref, results, selection, textEditor;
      this.removeDecorations();
      textEditor = this.minimap.getTextEditor();
      if ((textEditor.selections == null) || textEditor.selections.length === 0) {
        return;
      }
      ref = textEditor.getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        if (!selection.isEmpty()) {
          decoration = this.minimap.decorateMarker(selection.marker, {
            type: 'highlight-under',
            scope: '.minimap .minimap-selection .region',
            plugin: 'selection'
          });
          if (decoration != null) {
            this.decorations.push(decoration);
          }
          if (atom.config.get('minimap-selection.outlineSelection')) {
            decoration = this.minimap.decorateMarker(selection.marker, {
              type: 'highlight-outline',
              scope: '.minimap .minimap-selection .region-outline',
              plugin: 'selection'
            });
            if (decoration != null) {
              results.push(this.decorations.push(decoration));
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        } else if (atom.config.get('minimap-selection.highlightCursorsLines')) {
          decoration = this.minimap.decorateMarker(selection.marker, {
            type: 'line',
            scope: '.minimap .minimap-selection .cursor-line',
            plugin: 'selection'
          });
          if (decoration != null) {
            results.push(this.decorations.push(decoration));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    MinimapSelectionView.prototype.removeDecorations = function() {
      var decoration, i, len, ref;
      if (this.decorations.length === 0) {
        return;
      }
      ref = this.decorations;
      for (i = 0, len = ref.length; i < len; i++) {
        decoration = ref[i];
        if (decoration != null) {
          decoration.destroy();
        }
      }
      return this.decorations = [];
    };

    return MinimapSelectionView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAtc2VsZWN0aW9uL2xpYi9taW5pbWFwLXNlbGVjdGlvbi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007bUNBQ0osV0FBQSxHQUFhOztJQUVBLDhCQUFDLE9BQUQ7QUFDWCxVQUFBO01BRFksSUFBQyxDQUFBLFVBQUQ7O01BQ1osTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBO01BRVQsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBQyxDQUFBLGVBQXZCLENBQW5CO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxJQUFDLENBQUEsZUFBbEMsQ0FBbkI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsTUFBTSxDQUFDLGlCQUFQLENBQXlCLElBQUMsQ0FBQSxlQUExQixDQUFuQjtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isb0NBQXBCLEVBQTBELElBQUMsQ0FBQSxlQUEzRCxDQUFuQjtNQUVBLElBQUMsQ0FBQSxlQUFELENBQUE7SUFWVzs7bUNBWWIsT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsaUJBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO2FBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUhKOzttQ0FLVCxlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsSUFBQyxDQUFBLGlCQUFELENBQUE7TUFFQSxVQUFBLEdBQWEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQUE7TUFDYixJQUFXLCtCQUFELElBQTJCLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBdEIsS0FBZ0MsQ0FBckU7QUFBQSxlQUFBOztBQUVBO0FBQUE7V0FBQSxxQ0FBQTs7UUFDRSxJQUFHLENBQUksU0FBUyxDQUFDLE9BQVYsQ0FBQSxDQUFQO1VBQ0UsVUFBQSxHQUFhLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixTQUFTLENBQUMsTUFBbEMsRUFBMEM7WUFBQSxJQUFBLEVBQU0saUJBQU47WUFBeUIsS0FBQSxFQUFPLHFDQUFoQztZQUF1RSxNQUFBLEVBQVEsV0FBL0U7V0FBMUM7VUFDYixJQUFnQyxrQkFBaEM7WUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsVUFBbEIsRUFBQTs7VUFFQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEIsQ0FBSDtZQUNFLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsU0FBUyxDQUFDLE1BQWxDLEVBQTBDO2NBQUEsSUFBQSxFQUFNLG1CQUFOO2NBQTJCLEtBQUEsRUFBTyw2Q0FBbEM7Y0FBaUYsTUFBQSxFQUFRLFdBQXpGO2FBQTFDO1lBQ2IsSUFBZ0Msa0JBQWhDOzJCQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixVQUFsQixHQUFBO2FBQUEsTUFBQTttQ0FBQTthQUZGO1dBQUEsTUFBQTtpQ0FBQTtXQUpGO1NBQUEsTUFRSyxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FBSDtVQUNILFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsU0FBUyxDQUFDLE1BQWxDLEVBQTBDO1lBQUEsSUFBQSxFQUFNLE1BQU47WUFBYyxLQUFBLEVBQU8sMENBQXJCO1lBQWlFLE1BQUEsRUFBUSxXQUF6RTtXQUExQztVQUNiLElBQWdDLGtCQUFoQzt5QkFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsVUFBbEIsR0FBQTtXQUFBLE1BQUE7aUNBQUE7V0FGRztTQUFBLE1BQUE7K0JBQUE7O0FBVFA7O0lBTmU7O21DQW9CakIsaUJBQUEsR0FBbUIsU0FBQTtBQUNqQixVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsS0FBdUIsQ0FBakM7QUFBQSxlQUFBOztBQUNBO0FBQUEsV0FBQSxxQ0FBQTs7O1VBQUEsVUFBVSxDQUFFLE9BQVosQ0FBQTs7QUFBQTthQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFIRTs7Ozs7QUEzQ3JCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnZXZlbnQta2l0J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBNaW5pbWFwU2VsZWN0aW9uVmlld1xuICBkZWNvcmF0aW9uczogW11cblxuICBjb25zdHJ1Y3RvcjogKEBtaW5pbWFwKSAtPlxuICAgIGVkaXRvciA9IEBtaW5pbWFwLmdldFRleHRFZGl0b3IoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZEFkZEN1cnNvciBAaGFuZGxlU2VsZWN0aW9uXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIEBoYW5kbGVTZWxlY3Rpb25cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9uRGlkUmVtb3ZlQ3Vyc29yIEBoYW5kbGVTZWxlY3Rpb25cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAnbWluaW1hcC1zZWxlY3Rpb24ub3V0bGluZVNlbGVjdGlvbicsIEBoYW5kbGVTZWxlY3Rpb25cblxuICAgIEBoYW5kbGVTZWxlY3Rpb24oKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHJlbW92ZURlY29yYXRpb25zKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAbWluaW1hcCA9IG51bGxcblxuICBoYW5kbGVTZWxlY3Rpb246ID0+XG4gICAgQHJlbW92ZURlY29yYXRpb25zKClcblxuICAgIHRleHRFZGl0b3IgPSBAbWluaW1hcC5nZXRUZXh0RWRpdG9yKClcbiAgICByZXR1cm4gaWYgIXRleHRFZGl0b3Iuc2VsZWN0aW9ucz8gb3IgdGV4dEVkaXRvci5zZWxlY3Rpb25zLmxlbmd0aCBpcyAwXG5cbiAgICBmb3Igc2VsZWN0aW9uIGluIHRleHRFZGl0b3IuZ2V0U2VsZWN0aW9ucygpXG4gICAgICBpZiBub3Qgc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgICBkZWNvcmF0aW9uID0gQG1pbmltYXAuZGVjb3JhdGVNYXJrZXIoc2VsZWN0aW9uLm1hcmtlciwgdHlwZTogJ2hpZ2hsaWdodC11bmRlcicsIHNjb3BlOiAnLm1pbmltYXAgLm1pbmltYXAtc2VsZWN0aW9uIC5yZWdpb24nLCBwbHVnaW46ICdzZWxlY3Rpb24nKVxuICAgICAgICBAZGVjb3JhdGlvbnMucHVzaCBkZWNvcmF0aW9uIGlmIGRlY29yYXRpb24/XG5cbiAgICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLXNlbGVjdGlvbi5vdXRsaW5lU2VsZWN0aW9uJylcbiAgICAgICAgICBkZWNvcmF0aW9uID0gQG1pbmltYXAuZGVjb3JhdGVNYXJrZXIoc2VsZWN0aW9uLm1hcmtlciwgdHlwZTogJ2hpZ2hsaWdodC1vdXRsaW5lJywgc2NvcGU6ICcubWluaW1hcCAubWluaW1hcC1zZWxlY3Rpb24gLnJlZ2lvbi1vdXRsaW5lJywgcGx1Z2luOiAnc2VsZWN0aW9uJylcbiAgICAgICAgICBAZGVjb3JhdGlvbnMucHVzaCBkZWNvcmF0aW9uIGlmIGRlY29yYXRpb24/XG5cbiAgICAgIGVsc2UgaWYgYXRvbS5jb25maWcuZ2V0KCdtaW5pbWFwLXNlbGVjdGlvbi5oaWdobGlnaHRDdXJzb3JzTGluZXMnKVxuICAgICAgICBkZWNvcmF0aW9uID0gQG1pbmltYXAuZGVjb3JhdGVNYXJrZXIoc2VsZWN0aW9uLm1hcmtlciwgdHlwZTogJ2xpbmUnLCBzY29wZTogJy5taW5pbWFwIC5taW5pbWFwLXNlbGVjdGlvbiAuY3Vyc29yLWxpbmUnLCBwbHVnaW46ICdzZWxlY3Rpb24nKVxuICAgICAgICBAZGVjb3JhdGlvbnMucHVzaCBkZWNvcmF0aW9uIGlmIGRlY29yYXRpb24/XG5cblxuICByZW1vdmVEZWNvcmF0aW9uczogLT5cbiAgICByZXR1cm4gaWYgQGRlY29yYXRpb25zLmxlbmd0aCBpcyAwXG4gICAgZGVjb3JhdGlvbj8uZGVzdHJveSgpIGZvciBkZWNvcmF0aW9uIGluIEBkZWNvcmF0aW9uc1xuICAgIEBkZWNvcmF0aW9ucyA9IFtdXG4iXX0=
