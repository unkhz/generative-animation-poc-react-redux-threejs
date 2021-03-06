// @flow
import { createStore, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
import Reducers from 'app/reducers';

const create = applyMiddleware(Thunk)(createStore);

/* eslint-disable */
export default (): Function => create(Reducers, {});
/* eslint-enable */
