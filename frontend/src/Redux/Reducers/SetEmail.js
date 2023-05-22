import{SET_EMAIL} from "./../Actions/ActionType"
import { ACTION_STATES } from "../Actions/ActionStates";

const initialState = {
  email: "",
};
const emailReducer = (state = initialState, action) => {
 
  switch (action.type) {
    case SET_EMAIL: {
      return {
        ...state,
        email: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default emailReducer;