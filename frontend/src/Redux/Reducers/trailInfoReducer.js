import {GET_TRAIL,SET_TRAIL} from "../Actions/ActionType"

const initialState={
    current_trail:{}
}

function trailInfoReducer(state=initialState,action){
    
 switch(action.type){
     case GET_TRAIL:
         return state;

         case SET_TRAIL:
             return{
                 ...state,
                 current_trail: action.data
             }

            default:
                return state;
 }
}



export default trailInfoReducer;