import{ SET_USER_ID} from "./../Actions/ActionType"
import { ACTION_STATES } from "../Actions/ActionStates";

const initialState = {
  user_ID: "",
};
const userIDReducer = (state = initialState, action) => {
 
  switch (action.type) {
    case SET_USER_ID: {
      return {
        ...state,
        user_ID: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default userIDReducer;