import {position as sRange} from '../index.js';
import { parse as domify}  from '../node_modules/domify/index.js';

var selection = window.getSelection;

describe('selection-range', function(){
  var el;
    var sel;

  beforeEach(function(){
    el = domify('<div><p>hi! my name is s<strong>a<em>ll</em>y</strong>.</p>' +
    '<p class="bacon"><br> </p><p><br> </p><p>hello world</p></div>');
    document.body.appendChild(el);
    sel = selection();
    sel.removeAllRanges();
  });

  afterEach(function(){
    document.body.removeChild(el);
  });

  it('should handle empty spaces', function () {
    sRange(el, { start: el.textContent.length - 1 });
    var r = sRange(el);
    expect(r.start).toBe(el.textContent.length - 1);
    expect(r.end).toBe(el.textContent.length - 1);
  });

  it('should set at the beginning of an element if specified', function () {
    var ps = el.querySelectorAll('p');
    sRange(el, { start: ps[0].textContent.length, atStart: true });
    var r = sRange(el);
    expect(r.atStart).toEqual(true);
    var r = selection().getRangeAt(0);
    expect(r.startContainer.parentNode).toEqual(ps[1]);
  });

  it('should set at the end of an element if beginning not specified', function(){
    var ps = el.querySelectorAll('p');
    sRange(el, { start: ps[0].textContent.length });
    var r = sRange(el);
    var r = selection().getRangeAt(0);
    expect(r.startContainer.parentNode).toEqual(ps[0]);
  })

  it('should get the proper ranges for selection', function(){
    sRange(el, { start: 5, end: 10});
    var r = sRange(el);
    expect(r.start).toBe(5);
    expect(r.end).toBe(10);
  });

  it('should get the proper ranges for cursor', function(){
    sRange(el, { start: 0 });
    var r = sRange(el);
    expect(r.start).toBe(0);
    expect(r.end).toBe(0);
  });

  it('should set cursor to specific spot', function(){
    sRange(el, { start: 0 });
    var r = sRange(el);
    expect(r.start).toBe(0);
    expect(r.end).toBe(0);
  });

  it('should set selection', function(){
    var pos = { start: 10, end: 15 };
    sRange(el, pos);
    var r = sRange(el);
    expect(r.start).toBe(10);
    expect(r.end).toBe(15);
    var str = selection().toString();
    expect(str).toEqual('e is ');
  });

  it('should return selected nodes', function(){
    sRange(el, { start: 0, end: el.textContent.length - 1 });
    var r = sRange(el);
    expect(r.startContainer.nodeName).toBe('#text');
    expect(r.endContainer.nodeName).toBe('#text');
    expect(r.commonAncestorContainer.nodeName).toBe('DIV');
  });

  it('should not exceede the text length', function(){
    var p = el.textContent.length + 1;
    var pos = { start: p, end: p };
    sRange(el, pos);
    var r = sRange(el);
    expect(r.start).toBe(el.textContent.length);
    expect(r.end).toBe( el.textContent.length);
  });

});

function selectAt(elem, str) {
  var range = document.createRange();
  var i = elem.textContent.indexOf(str);

  // set to end
  if (~i) i++;
  else throw new Error('selectAt: unable to select');

  range.setStart(elem.firstChild, i);
  range.setEnd(elem.firstChild, i);
  sel.addRange(range);
}
