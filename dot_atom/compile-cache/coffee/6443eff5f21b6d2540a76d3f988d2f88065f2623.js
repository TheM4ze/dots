(function() {
  var a, colors, ex, k, toCamelCase, tocamelCase, v;

  colors = {
    alice_blue: '#f0f8ff',
    antique_white: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanched_almond: '#ffebcd',
    blue: '#0000ff',
    blue_violet: '#8a2be2',
    brown: '#a52a2a',
    burly_wood: '#deb887',
    cadet_blue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    corn_silk: '#fff8dc',
    cornflower_blue: '#6495ed',
    crimson: '#dc143c',
    cyan: '#00ffff',
    dark_blue: '#00008b',
    dark_cyan: '#008b8b',
    dark_golden_rod: '#b8860b',
    dark_gray: '#a9a9a9',
    dark_green: '#006400',
    dark_grey: '#a9a9a9',
    dark_khaki: '#bdb76b',
    dark_magenta: '#8b008b',
    dark_olive_green: '#556b2f',
    dark_orange: '#ff8c00',
    dark_orchid: '#9932cc',
    dark_red: '#8b0000',
    dark_salmon: '#e9967a',
    dark_seagreen: '#8fbc8f',
    dark_slateblue: '#483d8b',
    dark_slategray: '#2f4f4f',
    dark_slategrey: '#2f4f4f',
    dark_turquoise: '#00ced1',
    dark_violet: '#9400d3',
    deep_pink: '#ff1493',
    deep_skyblue: '#00bfff',
    dim_gray: '#696969',
    dim_grey: '#696969',
    dodger_blue: '#1e90ff',
    fire_brick: '#b22222',
    floral_white: '#fffaf0',
    forest_green: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghost_white: '#f8f8ff',
    gold: '#ffd700',
    golden_rod: '#daa520',
    gray: '#808080',
    green: '#008000',
    green_yellow: '#adff2f',
    grey: '#808080',
    honey_dew: '#f0fff0',
    hot_pink: '#ff69b4',
    indian_red: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavender_blush: '#fff0f5',
    lawn_green: '#7cfc00',
    lemon_chiffon: '#fffacd',
    light_blue: '#add8e6',
    light_coral: '#f08080',
    light_cyan: '#e0ffff',
    light_golden_rod_yellow: '#fafad2',
    light_gray: '#d3d3d3',
    light_green: '#90ee90',
    light_grey: '#d3d3d3',
    light_pink: '#ffb6c1',
    light_salmon: '#ffa07a',
    light_sea_green: '#20b2aa',
    light_sky_blue: '#87cefa',
    light_slate_gray: '#778899',
    light_slate_grey: '#778899',
    light_steel_blue: '#b0c4de',
    light_yellow: '#ffffe0',
    lime: '#00ff00',
    lime_green: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    medium_aquamarine: '#66cdaa',
    medium_blue: '#0000cd',
    medium_orchid: '#ba55d3',
    medium_purple: '#9370db',
    medium_sea_green: '#3cb371',
    medium_slate_blue: '#7b68ee',
    medium_spring_green: '#00fa9a',
    medium_turquoise: '#48d1cc',
    medium_violet_red: '#c71585',
    midnight_blue: '#191970',
    mint_cream: '#f5fffa',
    misty_rose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajo_white: '#ffdead',
    navy: '#000080',
    old_lace: '#fdf5e6',
    olive: '#808000',
    olive_drab: '#6b8e23',
    orange: '#ffa500',
    orange_red: '#ff4500',
    orchid: '#da70d6',
    pale_golden_rod: '#eee8aa',
    pale_green: '#98fb98',
    pale_turquoise: '#afeeee',
    pale_violet_red: '#db7093',
    papaya_whip: '#ffefd5',
    peach_puff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powder_blue: '#b0e0e6',
    purple: '#800080',
    rebecca_purple: '#663399',
    red: '#ff0000',
    rosy_brown: '#bc8f8f',
    royal_blue: '#4169e1',
    saddle_brown: '#8b4513',
    salmon: '#fa8072',
    sandy_brown: '#f4a460',
    sea_green: '#2e8b57',
    sea_shell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    sky_blue: '#87ceeb',
    slate_blue: '#6a5acd',
    slate_gray: '#708090',
    slate_grey: '#708090',
    snow: '#fffafa',
    spring_green: '#00ff7f',
    steel_blue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    white_smoke: '#f5f5f5',
    yellow: '#ffff00',
    yellow_green: '#9acd32'
  };

  module.exports = ex = {
    lower_snake: colors,
    UPPER_SNAKE: {},
    lowercase: {},
    UPPERCASE: {},
    camelCase: {},
    CamelCase: {},
    allCases: {}
  };

  toCamelCase = function(s) {
    return s[0].toUpperCase() + s.slice(1);
  };

  tocamelCase = function(s, i) {
    if (i === 0) {
      return s;
    } else {
      return s[0].toUpperCase() + s.slice(1);
    }
  };

  for (k in colors) {
    v = colors[k];
    a = k.split('_');
    ex.allCases[k] = ex.allCases[a.map(toCamelCase).join('')] = ex.allCases[a.map(tocamelCase).join('')] = ex.allCases[a.join('_').toUpperCase()] = ex.allCases[a.join('')] = ex.allCases[a.join('').toUpperCase()] = ex.CamelCase[a.map(toCamelCase).join('')] = ex.camelCase[a.map(tocamelCase).join('')] = ex.UPPER_SNAKE[a.join('_').toUpperCase()] = ex.lowercase[a.join('')] = ex.UPPERCASE[a.join('').toUpperCase()] = v;
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYmFieWplc3VzLy5hdG9tL3BhY2thZ2VzL3BpZ21lbnRzL2xpYi9zdmctY29sb3JzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUNFO0lBQUEsVUFBQSxFQUFZLFNBQVo7SUFDQSxhQUFBLEVBQWUsU0FEZjtJQUVBLElBQUEsRUFBTSxTQUZOO0lBR0EsVUFBQSxFQUFZLFNBSFo7SUFJQSxLQUFBLEVBQU8sU0FKUDtJQUtBLEtBQUEsRUFBTyxTQUxQO0lBTUEsTUFBQSxFQUFRLFNBTlI7SUFPQSxLQUFBLEVBQU8sU0FQUDtJQVFBLGVBQUEsRUFBaUIsU0FSakI7SUFTQSxJQUFBLEVBQU0sU0FUTjtJQVVBLFdBQUEsRUFBYSxTQVZiO0lBV0EsS0FBQSxFQUFPLFNBWFA7SUFZQSxVQUFBLEVBQVksU0FaWjtJQWFBLFVBQUEsRUFBWSxTQWJaO0lBY0EsVUFBQSxFQUFZLFNBZFo7SUFlQSxTQUFBLEVBQVcsU0FmWDtJQWdCQSxLQUFBLEVBQU8sU0FoQlA7SUFpQkEsU0FBQSxFQUFXLFNBakJYO0lBa0JBLGVBQUEsRUFBaUIsU0FsQmpCO0lBbUJBLE9BQUEsRUFBUyxTQW5CVDtJQW9CQSxJQUFBLEVBQU0sU0FwQk47SUFxQkEsU0FBQSxFQUFXLFNBckJYO0lBc0JBLFNBQUEsRUFBVyxTQXRCWDtJQXVCQSxlQUFBLEVBQWlCLFNBdkJqQjtJQXdCQSxTQUFBLEVBQVcsU0F4Qlg7SUF5QkEsVUFBQSxFQUFZLFNBekJaO0lBMEJBLFNBQUEsRUFBVyxTQTFCWDtJQTJCQSxVQUFBLEVBQVksU0EzQlo7SUE0QkEsWUFBQSxFQUFjLFNBNUJkO0lBNkJBLGdCQUFBLEVBQWtCLFNBN0JsQjtJQThCQSxXQUFBLEVBQWEsU0E5QmI7SUErQkEsV0FBQSxFQUFhLFNBL0JiO0lBZ0NBLFFBQUEsRUFBVSxTQWhDVjtJQWlDQSxXQUFBLEVBQWEsU0FqQ2I7SUFrQ0Es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LENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsRUFBeEIsQ0FBQSxDQUFiLEdBQ0EsRUFBRSxDQUFDLFdBQVksQ0FBQSxDQUFDLENBQUMsSUFBRixDQUFPLEdBQVAsQ0FBVyxDQUFDLFdBQVosQ0FBQSxDQUFBLENBQWYsR0FDQSxFQUFFLENBQUMsU0FBVSxDQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQUFBLENBQWIsR0FDQSxFQUFFLENBQUMsU0FBVSxDQUFBLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQUFVLENBQUMsV0FBWCxDQUFBLENBQUEsQ0FBYixHQUF5QztBQVozQztBQWxLQSIsInNvdXJjZXNDb250ZW50IjpbImNvbG9ycyA9XG4gIGFsaWNlX2JsdWU6ICcjZjBmOGZmJ1xuICBhbnRpcXVlX3doaXRlOiAnI2ZhZWJkNydcbiAgYXF1YTogJyMwMGZmZmYnXG4gIGFxdWFtYXJpbmU6ICcjN2ZmZmQ0J1xuICBhenVyZTogJyNmMGZmZmYnXG4gIGJlaWdlOiAnI2Y1ZjVkYydcbiAgYmlzcXVlOiAnI2ZmZTRjNCdcbiAgYmxhY2s6ICcjMDAwMDAwJ1xuICBibGFuY2hlZF9hbG1vbmQ6ICcjZmZlYmNkJ1xuICBibHVlOiAnIzAwMDBmZidcbiAgYmx1ZV92aW9sZXQ6ICcjOGEyYmUyJ1xuICBicm93bjogJyNhNTJhMmEnXG4gIGJ1cmx5X3dvb2Q6ICcjZGViODg3J1xuICBjYWRldF9ibHVlOiAnIzVmOWVhMCdcbiAgY2hhcnRyZXVzZTogJyM3ZmZmMDAnXG4gIGNob2NvbGF0ZTogJyNkMjY5MWUnXG4gIGNvcmFsOiAnI2ZmN2Y1MCdcbiAgY29ybl9zaWxrOiAnI2ZmZjhkYydcbiAgY29ybmZsb3dlcl9ibHVlOiAnIzY0OTVlZCdcbiAgY3JpbXNvbjogJyNkYzE0M2MnXG4gIGN5YW46ICcjMDBmZmZmJ1xuICBkYXJrX2JsdWU6ICcjMDAwMDhiJ1xuICBkYXJrX2N5YW46ICcjMDA4YjhiJ1xuICBkYXJrX2dvbGRlbl9yb2Q6ICcjYjg4NjBiJ1xuICBkYXJrX2dyYXk6ICcjYTlhOWE5J1xuICBkYXJrX2dyZWVuOiAnIzAwNjQwMCdcbiAgZGFya19ncmV5OiAnI2E5YTlhOSdcbiAgZGFya19raGFraTogJyNiZGI3NmInXG4gIGRhcmtfbWFnZW50YTogJyM4YjAwOGInXG4gIGRhcmtfb2xpdmVfZ3JlZW46ICcjNTU2YjJmJ1xuICBkYXJrX29yYW5nZTogJyNmZjhjMDAnXG4gIGRhcmtfb3JjaGlkOiAnIzk5MzJjYydcbiAgZGFya19yZWQ6ICcjOGIwMDAwJ1xuICBkYXJrX3NhbG1vbjogJyNlOTk2N2EnXG4gIGRhcmtfc2VhZ3JlZW46ICcjOGZiYzhmJ1xuICBkYXJrX3NsYXRlYmx1ZTogJyM0ODNkOGInXG4gIGRhcmtfc2xhdGVncmF5OiAnIzJmNGY0ZidcbiAgZGFya19zbGF0ZWdyZXk6ICcjMmY0ZjRmJ1xuICBkYXJrX3R1cnF1b2lzZTogJyMwMGNlZDEnXG4gIGRhcmtfdmlvbGV0OiAnIzk0MDBkMydcbiAgZGVlcF9waW5rOiAnI2ZmMTQ5MydcbiAgZGVlcF9za3libHVlOiAnIzAwYmZmZidcbiAgZGltX2dyYXk6ICcjNjk2OTY5J1xuICBkaW1fZ3JleTogJyM2OTY5NjknXG4gIGRvZGdlcl9ibHVlOiAnIzFlOTBmZidcbiAgZmlyZV9icmljazogJyNiMjIyMjInXG4gIGZsb3JhbF93aGl0ZTogJyNmZmZhZjAnXG4gIGZvcmVzdF9ncmVlbjogJyMyMjhiMjInXG4gIGZ1Y2hzaWE6ICcjZmYwMGZmJ1xuICBnYWluc2Jvcm86ICcjZGNkY2RjJ1xuICBnaG9zdF93aGl0ZTogJyNmOGY4ZmYnXG4gIGdvbGQ6ICcjZmZkNzAwJ1xuICBnb2xkZW5fcm9kOiAnI2RhYTUyMCdcbiAgZ3JheTogJyM4MDgwODAnXG4gIGdyZWVuOiAnIzAwODAwMCdcbiAgZ3JlZW5feWVsbG93OiAnI2FkZmYyZidcbiAgZ3JleTogJyM4MDgwODAnXG4gIGhvbmV5X2RldzogJyNmMGZmZjAnXG4gIGhvdF9waW5rOiAnI2ZmNjliNCdcbiAgaW5kaWFuX3JlZDogJyNjZDVjNWMnXG4gIGluZGlnbzogJyM0YjAwODInXG4gIGl2b3J5OiAnI2ZmZmZmMCdcbiAga2hha2k6ICcjZjBlNjhjJ1xuICBsYXZlbmRlcjogJyNlNmU2ZmEnXG4gIGxhdmVuZGVyX2JsdXNoOiAnI2ZmZjBmNSdcbiAgbGF3bl9ncmVlbjogJyM3Y2ZjMDAnXG4gIGxlbW9uX2NoaWZmb246ICcjZmZmYWNkJ1xuICBsaWdodF9ibHVlOiAnI2FkZDhlNidcbiAgbGlnaHRfY29yYWw6ICcjZjA4MDgwJ1xuICBsaWdodF9jeWFuOiAnI2UwZmZmZidcbiAgbGlnaHRfZ29sZGVuX3JvZF95ZWxsb3c6ICcjZmFmYWQyJ1xuICBsaWdodF9ncmF5OiAnI2QzZDNkMydcbiAgbGlnaHRfZ3JlZW46ICcjOTBlZTkwJ1xuICBsaWdodF9ncmV5OiAnI2QzZDNkMydcbiAgbGlnaHRfcGluazogJyNmZmI2YzEnXG4gIGxpZ2h0X3NhbG1vbjogJyNmZmEwN2EnXG4gIGxpZ2h0X3NlYV9ncmVlbjogJyMyMGIyYWEnXG4gIGxpZ2h0X3NreV9ibHVlOiAnIzg3Y2VmYSdcbiAgbGlnaHRfc2xhdGVfZ3JheTogJyM3Nzg4OTknXG4gIGxpZ2h0X3NsYXRlX2dyZXk6ICcjNzc4ODk5J1xuICBsaWdodF9zdGVlbF9ibHVlOiAnI2IwYzRkZSdcbiAgbGlnaHRfeWVsbG93OiAnI2ZmZmZlMCdcbiAgbGltZTogJyMwMGZmMDAnXG4gIGxpbWVfZ3JlZW46ICcjMzJjZDMyJ1xuICBsaW5lbjogJyNmYWYwZTYnXG4gIG1hZ2VudGE6ICcjZmYwMGZmJ1xuICBtYXJvb246ICcjODAwMDAwJ1xuICBtZWRpdW1fYXF1YW1hcmluZTogJyM2NmNkYWEnXG4gIG1lZGl1bV9ibHVlOiAnIzAwMDBjZCdcbiAgbWVkaXVtX29yY2hpZDogJyNiYTU1ZDMnXG4gIG1lZGl1bV9wdXJwbGU6ICcjOTM3MGRiJ1xuICBtZWRpdW1fc2VhX2dyZWVuOiAnIzNjYjM3MSdcbiAgbWVkaXVtX3NsYXRlX2JsdWU6ICcjN2I2OGVlJ1xuICBtZWRpdW1fc3ByaW5nX2dyZWVuOiAnIzAwZmE5YSdcbiAgbWVkaXVtX3R1cnF1b2lzZTogJyM0OGQxY2MnXG4gIG1lZGl1bV92aW9sZXRfcmVkOiAnI2M3MTU4NSdcbiAgbWlkbmlnaHRfYmx1ZTogJyMxOTE5NzAnXG4gIG1pbnRfY3JlYW06ICcjZjVmZmZhJ1xuICBtaXN0eV9yb3NlOiAnI2ZmZTRlMSdcbiAgbW9jY2FzaW46ICcjZmZlNGI1J1xuICBuYXZham9fd2hpdGU6ICcjZmZkZWFkJ1xuICBuYXZ5OiAnIzAwMDA4MCdcbiAgb2xkX2xhY2U6ICcjZmRmNWU2J1xuICBvbGl2ZTogJyM4MDgwMDAnXG4gIG9saXZlX2RyYWI6ICcjNmI4ZTIzJ1xuICBvcmFuZ2U6ICcjZmZhNTAwJ1xuICBvcmFuZ2VfcmVkOiAnI2ZmNDUwMCdcbiAgb3JjaGlkOiAnI2RhNzBkNidcbiAgcGFsZV9nb2xkZW5fcm9kOiAnI2VlZThhYSdcbiAgcGFsZV9ncmVlbjogJyM5OGZiOTgnXG4gIHBhbGVfdHVycXVvaXNlOiAnI2FmZWVlZSdcbiAgcGFsZV92aW9sZXRfcmVkOiAnI2RiNzA5MydcbiAgcGFwYXlhX3doaXA6ICcjZmZlZmQ1J1xuICBwZWFjaF9wdWZmOiAnI2ZmZGFiOSdcbiAgcGVydTogJyNjZDg1M2YnXG4gIHBpbms6ICcjZmZjMGNiJ1xuICBwbHVtOiAnI2RkYTBkZCdcbiAgcG93ZGVyX2JsdWU6ICcjYjBlMGU2J1xuICBwdXJwbGU6ICcjODAwMDgwJ1xuICByZWJlY2NhX3B1cnBsZTogJyM2NjMzOTknXG4gIHJlZDogJyNmZjAwMDAnXG4gIHJvc3lfYnJvd246ICcjYmM4ZjhmJ1xuICByb3lhbF9ibHVlOiAnIzQxNjllMSdcbiAgc2FkZGxlX2Jyb3duOiAnIzhiNDUxMydcbiAgc2FsbW9uOiAnI2ZhODA3MidcbiAgc2FuZHlfYnJvd246ICcjZjRhNDYwJ1xuICBzZWFfZ3JlZW46ICcjMmU4YjU3J1xuICBzZWFfc2hlbGw6ICcjZmZmNWVlJ1xuICBzaWVubmE6ICcjYTA1MjJkJ1xuICBzaWx2ZXI6ICcjYzBjMGMwJ1xuICBza3lfYmx1ZTogJyM4N2NlZWInXG4gIHNsYXRlX2JsdWU6ICcjNmE1YWNkJ1xuICBzbGF0ZV9ncmF5OiAnIzcwODA5MCdcbiAgc2xhdGVfZ3JleTogJyM3MDgwOTAnXG4gIHNub3c6ICcjZmZmYWZhJ1xuICBzcHJpbmdfZ3JlZW46ICcjMDBmZjdmJ1xuICBzdGVlbF9ibHVlOiAnIzQ2ODJiNCdcbiAgdGFuOiAnI2QyYjQ4YydcbiAgdGVhbDogJyMwMDgwODAnXG4gIHRoaXN0bGU6ICcjZDhiZmQ4J1xuICB0b21hdG86ICcjZmY2MzQ3J1xuICB0dXJxdW9pc2U6ICcjNDBlMGQwJ1xuICB2aW9sZXQ6ICcjZWU4MmVlJ1xuICB3aGVhdDogJyNmNWRlYjMnXG4gIHdoaXRlOiAnI2ZmZmZmZidcbiAgd2hpdGVfc21va2U6ICcjZjVmNWY1J1xuICB5ZWxsb3c6ICcjZmZmZjAwJ1xuICB5ZWxsb3dfZ3JlZW46ICcjOWFjZDMyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4ID1cbiAgbG93ZXJfc25ha2U6IGNvbG9yc1xuICBVUFBFUl9TTkFLRToge31cbiAgbG93ZXJjYXNlOiB7fVxuICBVUFBFUkNBU0U6IHt9XG4gIGNhbWVsQ2FzZToge31cbiAgQ2FtZWxDYXNlOiB7fVxuICBhbGxDYXNlczoge31cblxudG9DYW1lbENhc2UgPSAocykgLT4gc1swXS50b1VwcGVyQ2FzZSgpICsgc1sxLi4tMV1cbnRvY2FtZWxDYXNlID0gKHMsaSkgLT4gaWYgaSBpcyAwIHRoZW4gcyBlbHNlIHNbMF0udG9VcHBlckNhc2UoKSArIHNbMS4uLTFdXG5cbmZvciBrLHYgb2YgY29sb3JzXG4gIGEgPSBrLnNwbGl0KCdfJylcbiAgZXguYWxsQ2FzZXNba10gPVxuICBleC5hbGxDYXNlc1thLm1hcCh0b0NhbWVsQ2FzZSkuam9pbignJyldID1cbiAgZXguYWxsQ2FzZXNbYS5tYXAodG9jYW1lbENhc2UpLmpvaW4oJycpXSA9XG4gIGV4LmFsbENhc2VzW2Euam9pbignXycpLnRvVXBwZXJDYXNlKCldID1cbiAgZXguYWxsQ2FzZXNbYS5qb2luKCcnKV0gPVxuICBleC5hbGxDYXNlc1thLmpvaW4oJycpLnRvVXBwZXJDYXNlKCldID1cbiAgZXguQ2FtZWxDYXNlW2EubWFwKHRvQ2FtZWxDYXNlKS5qb2luKCcnKV0gPVxuICBleC5jYW1lbENhc2VbYS5tYXAodG9jYW1lbENhc2UpLmpvaW4oJycpXSA9XG4gIGV4LlVQUEVSX1NOQUtFW2Euam9pbignXycpLnRvVXBwZXJDYXNlKCldID1cbiAgZXgubG93ZXJjYXNlW2Euam9pbignJyldID1cbiAgZXguVVBQRVJDQVNFW2Euam9pbignJykudG9VcHBlckNhc2UoKV0gPSB2XG4iXX0=
