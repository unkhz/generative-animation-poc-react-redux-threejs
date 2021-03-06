import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ConnectedApp, {App} from 'containers/App';
import {styleDefinitions} from 'reducers/styles/definitions';
import {assert} from 'chai';
import {spy} from 'sinon';

function getNode(element: React.Element): Node {
  const node = TestUtils.renderIntoDocument(
    element
  );
  return ReactDOM.findDOMNode(node);
}

function getLayerNodes(node: Node): Array {
  return Array.prototype.slice.call(node.children)
    .filter((n: Node) => n.className === 'layer');
}

describe('App', () => {

  it('can be created without props', () => {
    const node = getNode(<App />);
    assert.equal(node.nodeType, 1);
  });

  it('dispatches requestParticleMove on start', () => {
    const props = {
      actions: {
        requestParticleMove: spy(),
        addStyle: spy(),
      }
    };
    const node = getNode(<App {...props} />);
    assert.isTrue(props.actions.requestParticleMove.calledOnce);
  });

  it('dispatches addStyle on start for each possible style', () => {
    const props = {
      actions: {
        requestParticleMove: spy(),
        addStyle: spy(),
      }
    };
    const node = getNode(<App {...props} />);
    assert.equal(props.actions.addStyle.callCount, styleDefinitions.length);
  });

  it('contains help without particle count', () => {
    const props = {
      aliveParticleCount: 0,
      particles: []
    };
    const node = getNode(<App {...props} />);
    assert.equal(node.firstChild.className, 'help');
    assert.equal(node.firstChild.getAttribute('data-count'), 0);
  });

  it('contains help with particle count', () => {
    const props = {
      aliveParticleCount: 2,
      particles: [{
        id: 0,
      },{
        id: 1,
      }]
    };
    const node = getNode(<App {...props} />);
    assert.equal(node.firstChild.className, 'help');
    assert.equal(node.firstChild.getAttribute('data-count'), 2);
  });

  it('contains layers from props', () => {
    const props = {
      layers: [
        {id: 0},
        {id: 1},
      ]
    };
    const node = getNode(<App {...props} />);
    const layerNodes = getLayerNodes(node);
    assert.equal(layerNodes.length, 2);
  });

  it('contains layers containing particles separated based on style name', () => {
    const props = {
      layers: [{
        id: 0,
        styleName: 'a'
      },{
        id: 1,
        styleName: 'b'
      }],
      particles: [
        {id: 0, styleName: 'a', style: {left: 1}},
        {id: 1, styleName: 'b', style: {left: 2}},
        {id: 2, styleName: 'a', style: {left: 3}},
        {id: 3, styleName: 'b', style: {left: 4}},
        {id: 4, styleName: 'b', style: {left: 5}},
        {id: 5, styleName: 'a', style: {left: 6}},
      ]
    };
    const node = getNode(<App {...props} />);
    const layerNodes = getLayerNodes(node);
    assert.equal(layerNodes.length, 2);
    assert.equal(layerNodes[0].children[0].style.left, '1px');
    assert.equal(layerNodes[0].children[1].style.left, '3px');
    assert.equal(layerNodes[0].children[2].style.left, '6px');
    assert.equal(layerNodes[1].children[0].style.left, '2px');
    assert.equal(layerNodes[1].children[1].style.left, '4px');
    assert.equal(layerNodes[1].children[2].style.left, '5px');
  });
});
