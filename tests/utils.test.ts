import { describe, expect, it } from 'vitest';

import { getElements } from '../src/utils';

describe('getElements', () => {
  const div = document.createElement('div');

  it('should return an array of elements when passed an array', () => {
    const elements = [div, div];
    expect(getElements(elements)).toEqual(elements);
  });

  it('should return an array of elements when passed a selector string', () => {
    document.body.innerHTML = `<div id="test" class="test"></div>`;
    const elements = document.querySelectorAll('#test');
    expect(getElements('#test')).toEqual(elements);
    expect(getElements('.test')).toEqual(elements);
  });

  it('should return an array with a single element when passed an HTMLElement', () => {
    expect(getElements(div)).toEqual([div]);
  });

  it('should return an array of elements when passed a NodeList', () => {
    const elements = [div, div];
    const nodeList = elements.map((element) => element);
    expect(getElements(nodeList)).toEqual(elements);
  });

  it('should return an array of elements when passed an HTMLCollection', () => {
    document.body.innerHTML = `
    <div class="test"></div>
    <div class="test"></div>
    <div class="test"></div>
    `;
    const collection = document.getElementsByClassName('.test');
    expect(getElements(collection)).toEqual(collection);
  });
});
