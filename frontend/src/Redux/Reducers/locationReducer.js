import filterSagaWatcher from "Redux/Sagas/filterCRUD";
import {GET_CATEGORIES, GET_FILTERS,SET_CATEGORIES,SET_FILTERS, SET_LOCATION} from "../Actions/ActionType"

const initialState={
    coordinates: []
}

function locationReducer(state=initialState,action){
 switch(action.type){
         case SET_LOCATION:
       
             return{
                 ...state,
                 coordinates: action.payload[0]
             }

            default:
                return state;
 }
}

export default locationReducer;