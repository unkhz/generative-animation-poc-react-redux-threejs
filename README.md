[![Build Status](https://travis-ci.org/unkhz/generative-animation-poc-react-redux-threejs.svg?branch=master)](https://travis-ci.org/unkhz/generative-animation-poc-react-redux-threejs)
[![Code Climate](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux-threejs/badges/gpa.svg)](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux-threejs)
[![Test Coverage](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux-threejs/badges/coverage.svg)](https://codeclimate.com/github/unkhz/generative-animation-poc-react-redux-threejs/coverage)

# Generative animation POC with React/Redux and ThreeJS

This is a WebGL fork of [generative-animation-poc-react-redux](https://github.com/unkhz/generative-animation-poc-react-redux)! I split it as a fork purely because of the huge size of ThreeJS.

  * React used for view layer / virtual DOM
  * ThreeJS used for animating on WebGL canvas
  * Redux used for state management
  * Idea of generative animation based on [Distract.js](https://github.com/unkhz/Distract.js)
  * [rr-boilerplate](https://github.com/a-tarasyuk/rr-boilerplate.git) used as the seed boilerplate

### Live demo

http://un.khz.fi/generative-animation-poc-react-redux-threejs/

### Dependencies

  * [React](https://facebook.github.io/react)
  * [Redux](https://github.com/rackt/redux)
  * [Webpack](https://webpack.github.io)
  * [Babel](https://babeljs.io)
  * [Flow](http://flowtype.org/)
  * [Karma](https://karma-runner.github.io/)
  * [Mocha](https://mochajs.org/)
  * [Threejs](http://threejs.org/)

### NPM tasks

- `npm run dev-server` starts local development web server in port 9999
- `npm start` starts production build and run local web server in port 9999
- `npm run build` starts production build
- `npm test` runs tests once
- `npm run test-watch` runs tests and watches for changes

### Findings

See main project https://github.com/unkhz/generative-animation-poc-react-redux
