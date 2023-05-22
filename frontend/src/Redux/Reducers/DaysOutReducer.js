import{GET_DAYS_OUT,SET_DAYS_OUT} from "../Actions/ActionType"

const initialState={
    daysOut:[]
}

function DaysOutReducer(state=initialState,action){
    
    switch(action.type){
        case GET_DAYS_OUT:
            return state;

            case SET_DAYS_OUT:
                return {
                    ...state,
                    daysOut: action.payload
                }
   
               default:
                   return state;
    }
}

export default DaysOutReducer;