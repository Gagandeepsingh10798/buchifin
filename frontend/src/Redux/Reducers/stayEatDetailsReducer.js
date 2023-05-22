import { GET_STAY_EAT_DETAILS, SET_CURRENT_STAY_HOME } from "Redux/Actions/ActionType";

  
  const initialState = {
    currentStayEat: {},
  };
  
  function StayEatDetailsReducer(state = initialState, action) {

    switch (action.type) {
      case GET_STAY_EAT_DETAILS:
        return state;
  
      case SET_CURRENT_STAY_HOME:
        return {
          ...state,
          currentStayEat: action.payload,
        };
      default:
        return state;
    }
  }
  
  export default StayEatDetailsReducer;