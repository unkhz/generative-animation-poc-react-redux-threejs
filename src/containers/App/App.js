// @flow
import 'styles/main.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as actions from 'actions/Actions';
import {styleDefinitions, decideStyle} from 'reducers/styles/definitions';
import type {ActionMapType, LayerType, GlobalStateType, ParticleType, StyleDefinitionType, StyleType} from 'constants/Types';
import Layer from 'components/Layer';
import { connect } from 'react-redux';
import {find} from 'lodash';
import ThreeApp from 'containers/ThreeApp';
import './App.scss';

type AppPropsType = {
  actions: ActionMapType,
  layers: LayerType[],
  particles: ParticleType[],
  aliveParticleCount: number,
}

type HelpType = {
  aliveParticleCount: number
}

class Help extends Component {

  shouldComponentUpdate(nextProps: Object): boolean {
    return nextProps.aliveParticleCount !== this.props.aliveParticleCount || nextProps.title !== this.props.title;
  }

  render(): React.Element {
    const {aliveParticleCount, title} = this.props;
    if (aliveParticleCount === 0) {
      return (
        <div className="help" data-count={aliveParticleCount}><div>
          scroll to add particles<br/>
          press enter to switch rendering mode
        </div></div>
      );
    } else {
      return (
        <div className="help" data-count={aliveParticleCount}>
          <div style={{float: 'right'}}>{title}</div>
          <div>{aliveParticleCount}</div>
        </div>
      );
    }
  }

}

export class App extends Component {

  static defaultProps = {
    actions: {
      requestParticleMove: () => undefined,
      addStyle: () => undefined,
    },
    layers: [],
    aliveParticleCount: 0,
    particles: [],
    env: {
      isRenderingToDOM: true,
    }
  };

  componentWillMount() {
    this.props.actions.requestParticleMove();
    styleDefinitions.map((styleDefinition: StyleDefinitionType) => {
      this.props.actions.addStyle(styleDefinition);
    });
    setInterval(this.recycleParticles.bind(this), 200);
  }

  recycleParticles() {
    if (this.props.particles.length > 10) {
      const styleName = decideStyle((s: StyleDefinitionType) => s.allowRecycling);
      const particleToDelete = find(this.props.particles, (p: ParticleType) => (
        !p.isToBeDestroyed && p.styleName === styleName
      ));
      if (particleToDelete) {
        this.props.actions.deleteParticle(particleToDelete.id);
        this.props.actions.addParticle(1, styleName);
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

  renderThree(): React.Element {
    return <ThreeApp />;
  }

  render(): React.Element {
    const { env, aliveParticleCount, layers } = this.props;
    const content = env.isRenderingToDOM ? this.renderLayers() : this.renderThree();
    return (
      <div className="full-screen-container app">
        <Help aliveParticleCount={aliveParticleCount} title={env.isRenderingToDOM ? 'DOM' : 'WebGL'} />
        {content}
      </div>
    );
  }
}

function mapStateToProps(state: GlobalStateType): GlobalStateType {
  const {env, layers, particles, aliveParticleCount} = state;
  return {
    env,
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
