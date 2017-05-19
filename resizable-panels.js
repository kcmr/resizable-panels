(function(Polymer) {

  'use strict';

  Polymer({
    is: 'resizable-panels',

    properties: {
      vertical: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true
      },

      _childrens: {
        type: Array,
        value: null
      }
    },

    listeners: {
      track: '_trackHandler'
    },

    // observers: [
    //   '_setDraggingDirection(vertical, _childrens)'
    // ],

    attached: function() {
      this._childrens = Polymer.dom(this).children;
      this._childCount = this._childrens.length;
      this._childrens.forEach(this._addKnobs.bind(this));
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

      this._nextSiblingDimensions = this._nextSiblingDimensions || next.getBoundingClientRect();
      this._previousSiblingDimensions = this._previousSiblingDimensions || previous.getBoundingClientRect();
      this._totalWidth = this._totalWidth || e.currentTarget.getBoundingClientRect().width;

      if (e.detail.dx < 0) {
        this._shrinkLeft(e, previous, next);
      } else {
        this._shrinkRight(e, previous, next);
      }
    },

    _onTrackEnd: function(e) {
      this.classList.remove('dragging');
      this._nextSiblingDimensions = null;
      this._previousSiblingDimensions = null;
      this._totalWidth = null;
      window.getSelection().removeAllRanges();
    },

    _getPct: function(currentWidth, total) {
      return Math.round(parseInt(currentWidth * 100) / parseInt(total));
    },

    _shrinkLeft: function(e, previous, next) {
      previous.style.cssText = 'width: calc(' + this._getPct(this._previousSiblingDimensions.width, this._totalWidth) + '% - ' + Math.abs(e.detail.dx) + 'px); flex-shrink: 0;';
      next.style.cssText     = 'width: calc(' + this._getPct(this._nextSiblingDimensions.width,     this._totalWidth) + '% + ' + Math.abs(e.detail.dx) + 'px); flex-shrink: 0;';
    },

    _shrinkRight: function(e, previous, next) {
      previous.style.cssText = 'width: calc(' + this._getPct(this._previousSiblingDimensions.width, this._totalWidth) + '% + ' + Math.abs(e.detail.dx) + 'px); flex-shrink: 0;';
      next.style.cssText     = 'width: calc(' + this._getPct(this._nextSiblingDimensions.width,     this._totalWidth) + '% - ' + Math.abs(e.detail.dx) + 'px); flex-shrink: 0;';
    }

  });

}(Polymer));


