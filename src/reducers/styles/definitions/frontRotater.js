// @flow weak
import { decide, noise, constrain, gradualConstrain, renderColorValue, randomColor} from 'utils/reducerHelpers';
import React from 'react';
import type {RuleType, StyleType, StyleValueType, GlobalStateType} from 'constants/Types';

export const allowRecycling = true;

export const name: string = 'frontRotater';

export function getInitialState(globalState: GlobalStateType): StyleType {
  const shape = decide(shapes, [0,1]);

  return {
    content: shape.dom(),
    threeContentColor: randomColor(),
    threeContent: shape.webGL(),
    style: {

    },
    env: {
      ...globalState.env
    },
    const: {
      minOpacity: 0.03,
      maxOpacity: 0.06,
      largeness: 0.5,
    },
    transform: {
      scale: constrain(1, 0.033, 0, globalState.env.radius/300, 0.033),
      rotateX: [Math.random() * 360, 'deg'],
      rotateY: [Math.random() * 360, 'deg'],
      rotateZ: [Math.random() * 360, 'deg'],
      translateX: [0, 'px'],
      translateY: [0, 'px'],
      translateZ: [0, 'px'],
    },
    speed: {
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      general: 0,
      z: 0,
    }
  };
}

export const rules = [
  ['transform.scale', (state: StyleType, value: StyleValueType) => gradualConstrain(value, 0.033, 0, state.env.radius/300, 0.033)],
  ['transform.translateX', (state: StyleType, [value, unit]: StyleValueType) => (
    [gradualConstrain(
      value,
      state.speed.translateX, -state.env.radius * state.const.largeness,
      state.env.radius * state.const.largeness,
      0.1
    ), unit]
  )],
  ['transform.translateY', (state: StyleType, [value, unit]: StyleValueType) => (
    [gradualConstrain(
      value,
      state.speed.translateY, -state.env.radius * state.const.largeness,
      state.env.radius * state.const.largeness,
      0.1
    ), unit]
  )],
  ['transform.translateZ', (state: StyleType, [value, unit]: StyleValueType) => (
    [gradualConstrain(
      value,
      state.speed.translateZ, -state.env.radius * state.const.largeness,
      state.env.radius * state.const.largeness,
      0.1
    ), unit]
  )],
  ['transform.rotateX', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateX, unit]],
  ['transform.rotateY', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateY, unit]],
  ['transform.rotateZ', (state: StyleType, [value, unit]: StyleValueType) => [value + state.speed.rotateZ, unit]],
  ['speed.z', (state: StyleType, value: StyleValueType) => constrain(value + noise(1000),-0.005,0.005)],
  ['speed.general', (state: StyleType, value: StyleValueType) => constrain(value + noise(100),-0.5,0.5)],
  ['speed.rotateX', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + noise(100), -0.5, 0.5)],
  ['speed.rotateY', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + noise(100), -0.5, 0.5)],
  ['speed.rotateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + noise(100), -0.5, 0.5)],
  ['speed.translateX', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + noise(100), -0.5, 0.5)],
  ['speed.translateY', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.general + noise(100), -0.5, 0.5)],
  ['speed.translateZ', (state: StyleType, value: StyleValueType) => constrain(value + state.speed.z + noise(1000), -0.005, 0.005)],
];

const shapes = [
  {
    webGL: () => (
      <extrudeGeometry>
        <shape>
          <moveTo x={20} y={0} />
          <lineTo x={0} y={80} />
          <lineTo x={50} y={100} />
          <lineTo x={100} y={80} />
          <lineTo x={80} y={0} />
          <lineTo x={20} y={0} />
        </shape>
      </extrudeGeometry>
    ),
    dom: () => (
      <svg width="300" height="300" viewBox="0 0 51 48" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
        <path fill={randomColor()} stroke="none" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
      </svg>
    )
  }, {
    webGL: () => (
      <circleGeometry radius={100} />
    ),
    dom: () => (
      <svg width="300" height="300" viewBox="0 0 100 100" color-rendering="optimizeSpeed" shape-rendering="optimizeSpeed">
        <path fill={randomColor()} stroke="none" d="M0,50a50,50 0 1,0 100,0a50,50 0 1,0 -100,0" />
      </svg>
    ),
  }
];
