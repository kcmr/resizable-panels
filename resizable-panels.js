(function(Polymer) {

  'use strict';

  Polymer({
    is: 'resizable-panels',

    properties: {
      /**
       * Vertical resizing. Default is horizontal.
       */
      vertical: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true
      },

      _childrens: {
        type: Array,
        value: null
      },

      _draggingDirection: {
        type: String,
        computed: '_setDraggingDirection(vertical, _childrens)'
      }
    },

    listeners: {
      track: '_trackHandler'
    },

    observers: [
      '_verticalObserver(_draggingDirection, _childrens)'
    ],

    attached: function() {
      this._childrens = Polymer.dom(this).children;
      this._childCount = this._childrens.length;
      this._childrens.forEach(this._addKnobs.bind(this));
    },

    _setDraggingDirection: function(vertical, _childrens) {
      if (_childrens) {
        return vertical ? 'vertical' : 'horizontal';
      }
    },

    _verticalObserver: function(_draggingDirection, _childrens) {
      if (_draggingDirection === 'vertical' && _childrens) {
        this.style.height = this.getBoundingClientRect().height + 'px';
      }
    },

    _addKnobs: function(panel, index) {
      if (index > 0) {
        var knob = document.createElement('div');
        knob.classList.add('knob', 'knob-panel-' + index);
        Polymer.dom(this).insertBefore(knob, panel);
      }
    },

    _isKnob: function(e) {
      return Polymer.dom(e).localTarget.className.indexOf('knob-panel-') >= 0;
    },

    _trackHandler: function(e) {
      var state = {
        'start': this._onTrackStart.bind(this),
        'track': this._onTrack.bind(this),
        'end': this._onTrackEnd.bind(this)
      };

      state[e.detail.state](e);
    },

    _onTrackStart: function(e) {
      window.getSelection().removeAllRanges();
    },

    _onTrack: function(e) {
      if (!this._isKnob(e)) {
        return;
      }

      this.classList.add('dragging');

      var next = Polymer.dom(e).localTarget.nextElementSibling;
      var previous = Polymer.dom(e).localTarget.previousElementSibling;

      this._nextSiblingDimensions = this._nextSiblingDimensions || this._computeDimensionsWithoutPadding(next);
      this._previousSiblingDimensions = this._previousSiblingDimensions || this._computeDimensionsWithoutPadding(previous);
      this._totalWidth = this._totalWidth || e.currentTarget.getBoundingClientRect().width;
      this._totalHeight = this._totalHeight || e.currentTarget.getBoundingClientRect().height;

      var hParams = { previous: previous, next: next, styleProperty: 'width', total: this._totalWidth, offset: Math.abs(e.detail.dx) };
      var vParams = { previous: previous, next: next, styleProperty: 'height', total: this._totalHeight, offset: Math.abs(e.detail.dy) };

      var resizeParams = {
        offset: this._draggingDirection === 'horizontal' ? e.detail.dx : e.detail.dy,
        params: this._draggingDirection === 'horizontal' ? hParams : vParams
      };

      this._resize(resizeParams.offset, resizeParams.params);
    },

    _computeDimensionsWithoutPadding: function(node) {
      var bcr = node.getBoundingClientRect();
      var cs = window.getComputedStyle(node);

      return {
        width: bcr.width - (parseInt(cs.paddingLeft) + parseInt(cs.paddingRight)),
        height: bcr.height - (parseInt(cs.paddingTop) + parseInt(cs.paddingBottom))
      };
    },

    _onTrackEnd: function(e) {
      this.classList.remove('dragging');
      this._nextSiblingDimensions = null;
      this._previousSiblingDimensions = null;
      this._totalWidth = null;
      this._totalHeight = null;
      window.getSelection().removeAllRanges();
    },

    _getPct: function(currentWidth, total) {
      return Math.round(parseInt(currentWidth * 100) / parseInt(total));
    },

    _resize: function(offset, params) {
      if (offset < 0) {
        this._shrinkPrevious(params);
      } else {
        this._shrinkNext(params);
      }
    },

    _shrinkPrevious: function(params) {
      params.previous.style.cssText = params.styleProperty + ': calc(' + this._getPct(this._previousSiblingDimensions[params.styleProperty], params.total) + '% - ' + params.offset + 'px); flex-shrink: 0;';
      params.next.style.cssText     = params.styleProperty + ': calc(' + this._getPct(this._nextSiblingDimensions[params.styleProperty],     params.total) + '% + ' + params.offset + 'px); flex-shrink: 0;';
    },

    _shrinkNext: function(params) {
      params.previous.style.cssText = params.styleProperty + ': calc(' + this._getPct(this._previousSiblingDimensions[params.styleProperty], params.total) + '% + ' + params.offset + 'px); flex-shrink: 0;';
      params.next.style.cssText     = params.styleProperty + ': calc(' + this._getPct(this._nextSiblingDimensions[params.styleProperty],     params.total) + '% - ' + params.offset + 'px); flex-shrink: 0;';
    }

  });

}(Polymer));


