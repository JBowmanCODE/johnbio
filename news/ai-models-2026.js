/* Interactive benchmark charts for /news/ai-models-2026
   Vanilla JS, no dependencies. Bars carry the series colour; all text uses
   ink tokens. Every value shown on hover is also directly labelled and
   present in the table view, so the tooltip enhances and never gates. */

(function () {
  'use strict';

  var SERIES_1 = '#00a3b0';
  var SERIES_2 = '#FF007F';
  var NS = 'http://www.w3.org/2000/svg';

  var CHARTS = {
    progress: {
      label: 'Benchmark progress',
      title: 'SWE-bench Verified, February 2025 to August 2026',
      sub: 'Share of real GitHub issues resolved, standard scaffold. Higher is better.',
      unit: '%',
      max: 100,
      series: [{ name: 'SWE-bench Verified', colour: SERIES_1 }],
      groups: [
        { cat: 'Claude 3.7 Sonnet', meta: 'Feb 2025', values: [63.7] },
        { cat: 'GPT-5', meta: 'Aug 2025', values: [74.9] },
        { cat: 'Claude Opus 4.5', meta: 'Nov 2025', values: [80.9] },
        { cat: 'Claude Opus 5', meta: 'Aug 2026', values: [97.0] }
      ],
      source: 'Vendor announcements; Vals AI leaderboard (14 August 2026). The Claude 3.7 Sonnet figure is the standard-scaffold score, not the 70.3% parallel-sampling result.'
    },
    gap: {
      label: 'The benchmark gap',
      title: 'The gap between benchmarks, then and now',
      sub: 'Best score on each benchmark at each date. Higher is better.',
      unit: '%',
      max: 100,
      series: [
        { name: 'September 2025', colour: SERIES_1 },
        { name: 'August 2026', colour: SERIES_2 }
      ],
      groups: [
        { cat: 'SWE-bench Verified', values: [74.9, 97.0] },
        { cat: 'SWE-bench Pro (public)', values: [23.3, 61.5] },
        { cat: 'SWE-bench Pro (commercial)', values: [17.8, 51.5] }
      ],
      source: 'Scale AI SWE-bench Pro leaderboards (launch figures 19 September 2025; current figures August 2026, led by Meta Muse Spark 1.1). Verified figures from vendor announcements and Vals AI.'
    },
    price: {
      label: 'The price picture',
      title: "Anthropic's most expensive model, input price per million tokens",
      sub: 'The flagship fell by two thirds. Then a new tier landed above it.',
      unit: '',
      prefix: '$',
      max: 16,
      series: [{ name: 'Price per million input tokens', colour: SERIES_1 }],
      groups: [
        { cat: 'Claude Opus 4.1', meta: 'Aug 2025', values: [15] },
        { cat: 'Claude Opus 4.5', meta: 'Nov 2025', values: [5] },
        { cat: 'Claude Fable 5', meta: 'Jun 2026', values: [10] }
      ],
      source: 'Anthropic published API pricing. Like-for-like across one vendor: workhorse tiers fell further (Sonnet 5 at $2, made permanent 10 August 2026), but Gemini Flash at $0.75 is promotional until 31 December 2026 and is not an Opus-class comparison.'
    }
  };

  /* The viewBox tracks the container's real pixel width so one SVG unit is
     one CSS pixel. A fixed viewBox would scale label text down to ~6px on a
     narrow phone; this keeps every label at its true size on any screen. */
  var VB_H = 320;
  var MIN_W = 260;
  var PAD = { top: 34, right: 14, bottom: 64, left: 14 };
  var MAX_BAR = 24;
  var GAP = 2;

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    }
    return node;
  }

  function fmt(chart, v) {
    return (chart.prefix || '') + v + (chart.unit || '');
  }

  /* Rounded data-end, square at the baseline. */
  function barPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, Math.max(h, 0));
    if (h <= 0.5) return 'M' + x + ',' + y + ' h' + w;
    return 'M' + x + ',' + (y + h) +
      ' L' + x + ',' + (y + r) +
      ' Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
      ' L' + (x + w - r) + ',' + y +
      ' Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) +
      ' L' + (x + w) + ',' + (y + h) + ' Z';
  }

  /* Wrap a category label to at most two lines that fit the band. */
  function wrap(text, maxChars) {
    var words = text.split(' ');
    var lines = [];
    var line = '';
    for (var i = 0; i < words.length; i++) {
      var next = line ? line + ' ' + words[i] : words[i];
      if (next.length > maxChars && line) { lines.push(line); line = words[i]; }
      else { line = next; }
    }
    if (line) lines.push(line);
    return lines.slice(0, 2);
  }

  function render(root, key) {
    var chart = CHARTS[key];
    var plot = root.querySelector('.amx-plot');
    var legend = root.querySelector('.amx-legend');
    var titleEl = root.querySelector('.amx-title');
    var subEl = root.querySelector('.amx-sub');
    var srcEl = root.querySelector('.amx-src');
    var tip = root.querySelector('.amx-tip');

    titleEl.textContent = chart.title;
    subEl.textContent = chart.sub;
    srcEl.textContent = 'Source: ' + chart.source;

    /* Legend: only for two or more series. */
    legend.textContent = '';
    if (chart.series.length > 1) {
      chart.series.forEach(function (s) {
        var item = document.createElement('span');
        item.className = 'amx-legend-item';
        var sw = document.createElement('span');
        sw.className = 'amx-swatch';
        sw.style.background = s.colour;
        var nm = document.createElement('span');
        nm.textContent = s.name;
        item.appendChild(sw);
        item.appendChild(nm);
        legend.appendChild(item);
      });
      legend.hidden = false;
    } else {
      legend.hidden = true;
    }

    var old = plot.querySelector('svg');
    if (old) old.remove();

    var VB_W = Math.max(MIN_W, Math.round(plot.clientWidth) || 680);

    var svg = el('svg', {
      class: 'amx-svg',
      viewBox: '0 0 ' + VB_W + ' ' + VB_H,
      role: 'img',
      'aria-label': chart.title + '. ' + chart.sub + ' Full values are in the table below the chart.'
    });

    var nG = chart.groups.length;
    var nS = chart.series.length;

    /* With two series the bars sit 2px apart, so a value label on each one
       would collide with its neighbour. Grouped charts therefore carry
       axis ticks and let the tooltip and table view supply exact figures;
       single-series charts label every bar directly and need no ticks. */
    var labelBars = nS === 1;
    var padLeft = labelBars ? PAD.left : 46;

    var plotW = VB_W - padLeft - PAD.right;
    var plotH = VB_H - PAD.top - PAD.bottom;
    var baseY = PAD.top + plotH;
    var scale = function (v) { return (v / chart.max) * plotH; };

    /* Bars are capped at 24px by the mark spec, so with only a few
       categories a full-width plot leaves them stranded in white space.
       Cap the band and centre the group instead of widening the marks. */
    var MAX_BAND = nS > 1 ? 190 : 150;
    var usableW = Math.min(plotW, MAX_BAND * nG);
    var originX = padLeft + (plotW - usableW) / 2;
    var band = usableW / nG;

    /* Gridlines (hairline, recessive) then the baseline. */
    for (var g = 0; g <= 4; g++) {
      var gy = PAD.top + (plotH / 4) * g;
      svg.appendChild(el('line', {
        class: g === 4 ? 'amx-axis-line' : 'amx-grid-line',
        x1: originX, x2: originX + usableW, y1: gy, y2: gy
      }));
      if (!labelBars) {
        var tickVal = chart.max * (1 - g / 4);
        var tk = el('text', {
          class: 'amx-tick', x: originX - 10, y: gy + 4, 'text-anchor': 'end'
        });
        tk.textContent = fmt(chart, Math.round(tickVal * 10) / 10);
        svg.appendChild(tk);
      }
    }
    var barW = Math.min(MAX_BAR, (band * 0.62 - GAP * (nS - 1)) / nS);
    var groupW = barW * nS + GAP * (nS - 1);

    chart.groups.forEach(function (grp, gi) {
      var bandX = originX + band * gi;
      var startX = bandX + (band - groupW) / 2;

      grp.values.forEach(function (v, si) {
        var h = scale(v);
        var x = startX + si * (barW + GAP);
        var y = baseY - h;

        var bar = el('path', {
          class: 'amx-bar',
          d: barPath(x, y, barW, h, 4),
          fill: chart.series[si].colour,
          tabindex: '0',
          role: 'button',
          'aria-label': grp.cat + ', ' + chart.series[si].name + ': ' + fmt(chart, v)
        });
        bar.dataset.group = String(gi);

        svg.appendChild(bar);

        if (labelBars) {
          var lab = el('text', {
            class: 'amx-val',
            x: x + barW / 2,
            y: y - 8,
            'text-anchor': 'middle'
          });
          lab.textContent = fmt(chart, v);
          svg.appendChild(lab);
        }
      });

      /* Category label, wrapped to two lines, plus optional date meta. */
      var cx = bandX + band / 2;
      var lines = wrap(grp.cat, Math.max(12, Math.floor(band / 6.6)));
      var t = el('text', { class: 'amx-cat', x: cx, y: baseY + 20, 'text-anchor': 'middle' });
      lines.forEach(function (ln, li) {
        var ts = el('tspan', { x: cx, dy: li === 0 ? 0 : 13 });
        ts.textContent = ln;
        t.appendChild(ts);
      });
      svg.appendChild(t);

      if (grp.meta) {
        var m = el('text', {
          class: 'amx-tick',
          x: cx,
          y: baseY + 20 + lines.length * 13 + 2,
          'text-anchor': 'middle'
        });
        m.textContent = grp.meta;
        svg.appendChild(m);
      }
    });

    plot.insertBefore(svg, tip);
    wireHover(plot, svg, tip, chart);
    buildTable(root, chart);
  }

  function wireHover(plot, svg, tip, chart) {
    var bars = svg.querySelectorAll('.amx-bar');

    function show(gi, target) {
      var grp = chart.groups[gi];
      tip.textContent = '';

      var cat = document.createElement('div');
      cat.className = 'amx-tip-cat';
      cat.textContent = grp.cat + (grp.meta ? ' · ' + grp.meta : '');
      tip.appendChild(cat);

      grp.values.forEach(function (v, si) {
        var row = document.createElement('div');
        row.className = 'amx-tip-row';
        var key = document.createElement('span');
        key.className = 'amx-tip-key';
        key.style.background = chart.series[si].colour;
        var val = document.createElement('span');
        val.className = 'amx-tip-val';
        val.textContent = fmt(chart, v);
        var nm = document.createElement('span');
        nm.className = 'amx-tip-name';
        nm.textContent = chart.series[si].name;
        row.appendChild(key);
        row.appendChild(val);
        row.appendChild(nm);
        tip.appendChild(row);
      });

      var pr = plot.getBoundingClientRect();
      var br = target.getBoundingClientRect();
      var left = br.left - pr.left + br.width / 2;
      tip.style.left = Math.max(70, Math.min(pr.width - 70, left)) + 'px';
      tip.style.top = (br.top - pr.top - 10) + 'px';
      tip.classList.add('is-visible');

      plot.classList.add('is-hovering');
      bars.forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.group === String(gi));
      });
    }

    function hide() {
      tip.classList.remove('is-visible');
      plot.classList.remove('is-hovering');
      bars.forEach(function (b) { b.classList.remove('is-active'); });
    }

    bars.forEach(function (bar) {
      var gi = parseInt(bar.dataset.group, 10);
      bar.addEventListener('pointerenter', function () { show(gi, bar); });
      bar.addEventListener('focus', function () { show(gi, bar); });
      bar.addEventListener('blur', hide);
    });

    plot.addEventListener('pointerleave', hide);
  }

  function buildTable(root, chart) {
    var wrapEl = root.querySelector('.amx-table-wrap');
    wrapEl.textContent = '';

    var table = document.createElement('table');
    table.className = 'amx-table';

    var cap = document.createElement('caption');
    cap.textContent = chart.title + ' — full data';
    table.appendChild(cap);

    var thead = document.createElement('thead');
    var hr = document.createElement('tr');
    ['', ].concat(chart.series.map(function (s) { return s.name; })).forEach(function (h, i) {
      var th = document.createElement('th');
      th.scope = 'col';
      th.textContent = i === 0 ? 'Model or benchmark' : h;
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    chart.groups.forEach(function (grp) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.scope = 'row';
      th.textContent = grp.cat + (grp.meta ? ' (' + grp.meta + ')' : '');
      tr.appendChild(th);
      grp.values.forEach(function (v) {
        var td = document.createElement('td');
        td.textContent = fmt(chart, v);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrapEl.appendChild(table);
  }

  function init() {
    var root = document.querySelector('.amx-charts');
    if (!root) return;

    var tabs = root.querySelectorAll('.amx-tab');
    var current = 'progress';

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        current = tab.dataset.chart;
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', String(t === tab));
        });
        render(root, current);
      });
    });

    var toggle = root.querySelector('.amx-toggle');
    var tableWrap = root.querySelector('.amx-table-wrap');
    tableWrap.hidden = true;
    toggle.addEventListener('click', function () {
      var open = tableWrap.hidden;
      tableWrap.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Hide the data table' : 'Show the data as a table';
    });

    render(root, current);

    /* Re-render on a real width change so the pixel-matched viewBox keeps
       label sizes true after rotation or a resize. */
    var lastW = root.querySelector('.amx-plot').clientWidth;
    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var w = root.querySelector('.amx-plot').clientWidth;
        if (Math.abs(w - lastW) > 8) { lastW = w; render(root, current); }
      }, 180);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
