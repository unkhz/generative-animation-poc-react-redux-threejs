import 'styles/main.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/Actions';
import {styleDefinitions, decideStyle} from 'reducers/styles/definitions';
import type {ActionMapType, LayerType, GlobalStateType, ParticleType, StyleDefinitionType, StyleType} from 'constants/Types';
import Layer from 'components/Layer';
import { connect } from 'react-redux';
import {find} from 'lodash';
import Three from 'react-three-renderer';
import {Vector3, Vector2, Euler} from 'three';

type ThreeAppPropsType = {
  actions: ActionMapType,
  layers: LayerType[],
  particles: ParticleType[],
  aliveParticleCount: number,
  env: Object
}

function value(prop: any): number {
  if (!Array.isArray(prop)) {
    return prop;
  } else {
    const [value, unit] = prop;
    if (unit == 'deg') {
      return value * 180 / Math.PI;
    } else {
      return value;
    }
  }
}

class ThreeParticle extends Component {

  shouldComponentUpdate(nextProps: ParticleType): boolean {
    return nextProps.sn === this.props.sn;
  }

  render(): React.Element {

    const {transform, style, threeContent, threeContentColor} = this.props;

    /*const complexGeom = complex(this.props.threeContent);
    const geom = {
      vertices: complexGeom.vertices,
      name: complexGeom.name,
      faceVertexUvs: complexGeom.faceVertexUvs,
      faces: complexGeom.faces,
      resourceId: complexGeom.resourceId,
    };*/

    const meshProps = {
      rotation: new Euler(
        value(transform.rotateX) || 0,
        value(transform.rotateY) || 0,
        value(transform.rotateZ) || 0,
      ),
      position: new Vector3(
        value(transform.translateX) || 0,
        value(transform.translateY) || 0,
        value(transform.translateZ) || 0,
      ),
      scale: new Vector3(
        (value(transform.scaleX) || value(transform.scale) || 1) * 2,
        (value(transform.scaleY) || value(transform.scale) || 1) * 2,
        (value(transform.scaleZ) || value(transform.scale) || 1) * 2,
      )
    };

    const materialProps = {
      color: threeContentColor,
      opacity: style.opacity,
      transparent: true,
      visible: true,
      //shininess: 100,
      //specular: 0x005500,
    };

    return (
      <mesh {...meshProps}>
        {threeContent}
        <meshLambertMaterial {...materialProps} />
      </mesh>
    );
  }

}

export class ThreeApp extends Component {

  renderParticles(props: LayerType): React.Element[] {
    const {particles} = props;
    return particles.map((particle: ParticleType): React.Element => {
      return (
        <ThreeParticle
          key={ particle.id }
          { ...particle }
        />
      );
    });
  }

  render(): React.Element {
    const {width, height} = this.props.env;
    const cameraprops = {
      fov: 45,
      aspect: width / height,
      near: -300,
      far: 300,
      position: new Vector3(0,10,-1000),
      rotation: new Euler(0,0,Math.PI/2),
      lookAt: new Vector3(0,0,0),
    };

    const threeProps = {
      precision: 'highp',
      antialias: true,
      width,
      height,
      mainCamera: 'camera',
      alpha: true,
    };

    return (
      <Three {...threeProps}>
        <scene>
          <perspectiveCamera name="camera" {...cameraprops} />
          <ambientLight color={0xffffff} />
          {this.renderParticles(this.props)}
        </scene>
      </Three>
    );
  }
}

function mapStateToProps(state: GlobalStateType): GlobalStateType {
  const {env, layers, particles, aliveParticleCount} = state;
  return {
    layers,
    particles,
    aliveParticleCount,
    env
  };
}

function mapDispatchToProps(dispatch: Function): Object {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeApp);
