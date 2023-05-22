import{GET_ACTIVITY,SET_ACTIVITY} from "../Actions/ActionType"

const initialState={
    activity:[]
}

function activityReducer(state=initialState,action){
    
    switch(action.type){
        case GET_ACTIVITY:
            return state;

            case SET_ACTIVITY:
                return {
                    ...state,
                    activity: action.payload
                }
   
               default:
                   return state;
    }
}

export default activityReducer;