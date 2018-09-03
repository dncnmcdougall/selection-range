/**
 * Module Dependencies
 */

// var iterator = require('dom-iterator');
var selection = window.getSelection();


/**
 * Get or set cursor, selection, relative to
 * an element.
 *
 * @param  {Element} el
 * @param  {Object} pos selection range
 * @return {Object|Undefined}
 */


function position(el, pos){

  /**
   * Get cursor or selection position
   */

  if (1 == arguments.length) {
    if (!selection.rangeCount) return;
    var indexes = {};
    var range = selection.getRangeAt(0);
    var clone = range.cloneRange();
    clone.selectNodeContents(el);
    clone.setEnd(range.endContainer, range.endOffset);
    indexes.end = clone.toString().length;
    clone.setStart(range.startContainer, range.startOffset);
    indexes.start = indexes.end - clone.toString().length;
    indexes.atStart = clone.startOffset === 0;
    indexes.commonAncestorContainer = clone.commonAncestorContainer;
    indexes.endContainer = clone.endContainer;
    indexes.startContainer = clone.startContainer;
    return indexes;
  }

  /**
   * Set cursor or selection position
   */

  var setSelection = pos.end && (pos.end !== pos.start);
  var length = 0;
  var range = document.createRange();

    var it = document.createNodeIterator(el,
        NodeFilter.SHOW_ALL, {
            acceptNode: function(node) {
                if ( node.nodeType == Node.TEXT_NODE ) {
                    return NodeFilter.FILTER_ACCEPT;
                } else if ( node.nodeType == Node.ELEMENT_NODE 
                    && node.nodeName == "BR" ) {
                        return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            }
        });

  // var it = iterator(el).select(Node.TEXT_NODE).revisit(false);
  var next;
  var startindex;
  var start = pos.start > el.textContent.length ? el.textContent.length : pos.start;
  var end = pos.end > el.textContent.length ? el.textContent.length : pos.end;
  var atStart = pos.atStart;

  while (next = it.nextNode()){
    var olen = length;
    length += next.textContent.length;

    // Set start point of selection
    var atLength = atStart ? length > start : length >= start;
    if (!startindex && atLength) {
      startindex = true;
      range.setStart(next, start - olen);
      if (!setSelection) {
        range.collapse(true);
        makeSelection(el, range);
        break;
      }
    }

    // Set end point of selection
    if (setSelection && (length >= end)) {
      range.setEnd(next, end - olen);
      makeSelection(el, range);
      break;
    }
  }
  if ( !startindex && atStart && length>=start ) {
      startindex = true;
      range.setStartAfter(el.lastChild);
      range.collapse(true);
      makeSelection(el, range);
  }
}

/**
 * add selection / insert cursor.
 *
 * @param  {Element} el
 * @param  {Range} range
 */

function makeSelection(el, range){
  el.focus();
  selection.removeAllRanges();
  selection.addRange(range);
}

if ( typeof module !== 'undefined' ) {
    module.exports = position;
}
