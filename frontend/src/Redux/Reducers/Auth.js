import{SET_AUTHTOKEN} from "./../Actions/ActionType"
import { ACTION_STATES } from "../Actions/ActionStates";

const initialState = {
  token: null,
};
const authReducer = (state = initialState, action) => {
 
  switch (action.type) {
    case SET_AUTHTOKEN: {
      return {
        ...state,
        token: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default authReducer;
