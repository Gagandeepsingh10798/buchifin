
import {SET_NOTIFICATIONS} from "../Actions/ActionType"

const initialState={
    notifications: []
}

function NotificationReducer(state=initialState,action){
 switch(action.type){

         case SET_NOTIFICATIONS:
             return{
                 ...state,
                 notifications: action.payload
             }

            default:
                return state;
 }
}

export default NotificationReducer;