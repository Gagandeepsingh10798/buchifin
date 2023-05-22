import {GET_TRAILS,SET_TRAILS} from "../Actions/ActionType"

const initialState={
    trails:[]
}

function trailReducer(state=initialState,action){
    
 switch(action.type){
     case GET_TRAILS:
         return state;

         case SET_TRAILS:
             return{
                 ...state,
                 trails: action.payload   
             }

            default:
                return state;
 }
}



export default trailReducer;