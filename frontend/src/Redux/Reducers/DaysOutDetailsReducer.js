import{GET_DAYS_OUT_DETAILS, SET_DAYS_OUT_DETAILS} from "../Actions/ActionType"

const initialState={
    currentDaysOut:{}
}

function DaysOutDetailsReducer(state=initialState,action){
    
    switch(action.type){
        case GET_DAYS_OUT_DETAILS:
            return state;

            case SET_DAYS_OUT_DETAILS:
                return {
                    ...state,
                    currentDaysOut: action.payload
                }
   
               default:
                   return state;
    }
}

export default DaysOutDetailsReducer;