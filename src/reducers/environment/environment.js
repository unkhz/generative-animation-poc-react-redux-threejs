// @flow
import {initPartialState} from 'utils/reducerHelpers';
import {ActionType, GlobalStateType} from 'constants/Types';
import * as actionTypes from 'constants/ActionTypes';

const initialState = {
  env: {
    radius: 100,
    width: 100,
    height: 100,
    isRenderingToDOM: false,
  },
};

export function environment(state: GlobalStateType, action: ActionType): GlobalStateType {
  state = initPartialState(state, initialState, 'env');
  switch (action.type) {
    case actionTypes.ENV_RESIZED:
      return {
        ...state,
        env: {
          radius: Math.min(action.width, action.height)/2,
          width: action.width,
          height: action.height,
          isRenderingToDOM: state.env.isRenderingToDOM,
        }
      };

    case actionTypes.TOGGLE_RENDER_MODE:
      return {
        ...state,
        env: {
          ...state.env,
          isRenderingToDOM: !state.env.isRenderingToDOM,
        }
      };

    default:
      return state;
  }
}
