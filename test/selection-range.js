import { parse as domify}  from '../node_modules/domify/index.js';

var sRange = position;

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
  it('should select the end of the element if out of range.', function(){
    var el1 = domify('<div class="first"><p>The cat jumped</p><p id="firstBr"><br></p></div>');
    var el2 = domify('<div class="second"><p>The cat jumped</p><p id="secondBr"><br></p></div>');
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    var ps1 = document.getElementById('firstBr');
    var ps2 = document.getElementById('secondBr');
    var range = document.createRange();
    range.setStartBefore( el1.lastChild.lastChild );
    range.collapse(true);
    sel.addRange(range);
    
    var r1 = sRange(el1);
    expect(r1.start).toBe(el1.textContent.length);
    expect(r1.end).toBe( el1.textContent.length);

    expect(r1.startContainer).toEqual(ps1);
    expect(r1.endContainer).toEqual(ps1);
    expect(r1.commonAncestorContainer).toEqual(ps1);

    sRange(el2, r1);
    var r2 = sRange(el2);
    expect(r2.startContainer).toEqual(ps2);
    expect(r2.endContainer).toEqual(ps2);
    expect(r2.commonAncestorContainer).toEqual(ps2);

    expect(r1.start).toEqual(r2.start);
    expect(r1.end).toEqual(r2.end);

    document.body.removeChild(el1);
    document.body.removeChild(el2);
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
