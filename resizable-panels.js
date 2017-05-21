class ResizablePanels extends Polymer.GestureEventListeners(Polymer.Element) {
  static get is() { return 'resizable-panels' }

  static get properties() {
    return {
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
    }
  }

  static get observers() {
    return [
      '_verticalObserver(_draggingDirection, _childrens)'
    ]
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    Polymer.Gestures.addListener(this, 'track', e => this._trackHandler(e));
    setTimeout(function() {
      this._childrens = [].filter.call(this.childNodes, (node) => node.nodeType === Node.ELEMENT_NODE);
      [].forEach.call(this._childrens, this._addKnobs.bind(this));
    }.bind(this), 16);
  }

  _setDraggingDirection(vertical, _childrens) {
    if (_childrens) {
      return vertical ? 'vertical' : 'horizontal';
    }
  }

  _verticalObserver(_draggingDirection, _childrens) {
    if (_draggingDirection === 'vertical' && _childrens) {
      this.style.height = this.getBoundingClientRect().height + 'px';
    }
  }

  _addKnobs(panel, index) {
    if (index > 0) {
      var knob = document.createElement('div');
      knob.classList.add('knob', 'knob-panel-' + index);
      this.insertBefore(knob, panel);
    }
  }

  _isKnob(e) {
    return e.target.className.indexOf('knob-panel-') >= 0;
  }

  _trackHandler(e) {
    var state = {
      'start': this._onTrackStart.bind(this),
      'track': this._onTrack.bind(this),
      'end': this._onTrackEnd.bind(this)
    };

    state[e.detail.state](e);
  }

  _onTrackStart(e) {
    window.getSelection().removeAllRanges();
  }

  _onTrack(e) {
    if (!this._isKnob(e)) {
      return;
    }

    this.classList.add('dragging');

    var next = e.target.nextElementSibling;
    var previous = e.target.previousElementSibling;

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
  }

  _computeDimensionsWithoutPadding(node) {
    var bcr = node.getBoundingClientRect();
    var cs = window.getComputedStyle(node);

    return {
      width: bcr.width - (parseInt(cs.paddingLeft) + parseInt(cs.paddingRight)),
      height: bcr.height - (parseInt(cs.paddingTop) + parseInt(cs.paddingBottom))
    };
  }

  _onTrackEnd() {
    this.classList.remove('dragging');
    this._nextSiblingDimensions = null;
    this._previousSiblingDimensions = null;
    this._totalWidth = null;
    this._totalHeight = null;
    window.getSelection().removeAllRanges();
  }

  _getPct(currentWidth, total) {
    return Math.round(parseInt(currentWidth * 100) / parseInt(total));
  }

  _resize(offset, params) {
    if (offset < 0) {
      this._shrinkPrevious(params);
    } else {
      this._shrinkNext(params);
    }
  }

  _isResizedToMinimum(node, styleProperty) {
    return parseInt(window.getComputedStyle(node)[styleProperty]) === 0;
  }

  /** 
   * Big 💩 -> PR's are welcome :)
   * @ignore
   */
  _shrinkPrevious(params) {
    params.previous.style.cssText = params.styleProperty + ': calc(' + this._getPct(this._previousSiblingDimensions[params.styleProperty], params.total) + '% - ' + params.offset + 'px); flex-shrink: 0;';
    if (!this._isResizedToMinimum(params.previous, params.styleProperty)) {
      params.next.style.cssText = params.styleProperty + ': calc(' + this._getPct(this._nextSiblingDimensions[params.styleProperty], params.total) + '% + ' + params.offset + 'px); flex-shrink: 0;';
    }
  }

  _shrinkNext(params) {
    params.next.style.cssText = params.styleProperty + ': calc(' + this._getPct(this._nextSiblingDimensions[params.styleProperty], params.total) + '% - ' + params.offset + 'px); flex-shrink: 0;';
    if (!this._isResizedToMinimum(params.next, params.styleProperty)) {
      params.previous.style.cssText = params.styleProperty + ': calc(' + this._getPct(this._previousSiblingDimensions[params.styleProperty], params.total) + '% + ' + params.offset + 'px); flex-shrink: 0;';
    }
  }
}

customElements.define(ResizablePanels.is, ResizablePanels);
