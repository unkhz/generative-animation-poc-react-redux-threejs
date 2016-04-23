// @flow
import 'styles/main.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/Actions';
import {styleFactories, decideStyle} from 'constants/StyleFactories';
import type {ActionMapType, LayerType, GlobalStateType, ParticleType, StyleFactoryType, StyleType} from 'constants/Types';
import Layer from 'components/Layer';
import { connect } from 'react-redux';
import {find} from 'lodash';
import './App.scss';

type AppPropsType = {
  actions: ActionMapType,
  layers: LayerType[],
  particles: ParticleType[],
  aliveParticleCount: number,
}

export class App extends Component {

  static defaultProps = {
    actions: {
      requestParticleMove: () => undefined,
      addStyle: () => undefined,
    },
    layers: [],
    aliveParticleCount: 0,
    particles: []
  };

  componentWillMount() {
    this.props.actions.requestParticleMove();
    styleFactories.map(({create}: StyleFactoryType) => {
      this.props.actions.addStyle(create());
    });
    setInterval(this.recycleParticles.bind(this), 200);
  }

  recycleParticles() {
    const recyclableStyles = styleFactories.filter((s: StyleFactoryType) => s.allowRecycling);
    const recyclableStyleNames = recyclableStyles.map((s: StyleFactoryType) => s.name);
    if ( recyclableStyles.length > 0 && this.props.particles.length > 10) {
      const particleToDelete = find(this.props.particles, (p: ParticleType) => (
        !p.isToBeDestroyed && recyclableStyleNames.indexOf(p.styleName) !== -1
      ));
      if (particleToDelete) {
        this.props.actions.deleteParticle(particleToDelete.id);
        this.props.actions.addParticle(1, decideStyle(recyclableStyles));
      }
    }
  }

  renderLayers(): React.Element {
    const {layers, particles} = this.props;
    return layers.map((layer: LayerType): React.Element => {
      return (
        <Layer
          key={layer.id}
          { ...layer }
          particles={ particles.filter((particle: ParticleType) => particle.styleName === layer.styleName) }
        />
      );
    });
  }

  renderHelp(): React.Element {
    const {layers, aliveParticleCount, particles} = this.props;
    if (aliveParticleCount === 0) {
      return (
        <div className="help" data-count={aliveParticleCount}><div>
          scroll to add particles<br/>
          space to pause
        </div></div>
      );
    } else {
      return <div className="layer help" data-count={aliveParticleCount}><div>{aliveParticleCount}</div></div>;
    }
  }

  render(): React.Element {
    const { layers } = this.props;
    return (
      <div className="full-screen-container app">
        {this.renderHelp()}
        {this.renderLayers()}
      </div>
    );
  }
}

function mapStateToProps(state: GlobalStateType): GlobalStateType {
  const {layers, particles, aliveParticleCount} = state;
  return {
    layers,
    particles,
    aliveParticleCount
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
)(App);
