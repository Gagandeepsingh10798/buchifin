import {
  GET_STAY_HOME,
  SET_CURRENT_STAY_HOME,
  SET_STAY_HOME,
} from "../Actions/ActionType";

const initialState = {
  stayOrEat: [],
};

function StayEatReducer(state = initialState, action) {
  switch (action.type) {
    case GET_STAY_HOME:
      return state;

    case SET_STAY_HOME:
      return {
        ...state,
        stayOrEat: action.payload,
      };
    default:
      return state;
  }
}

export default StayEatReducer;
