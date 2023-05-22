import {GET_PROFILES,SET_PROFILES} from "../Actions/ActionType"

const initialState={
    profiles:[]
}

function profileReducer(state=initialState,action){
    
 switch(action.type){
     case GET_PROFILES:
         return state;

         case SET_PROFILES:
             return{
                 ...state,
                 profiles: action.payload   
             }

            default:
                return state;
 }
}



export default profileReducer;