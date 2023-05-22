import filterSagaWatcher from "Redux/Sagas/filterCRUD";
import {GET_CATEGORIES, GET_FILTERS,SET_CATEGORIES,SET_FILTERS} from "../Actions/ActionType"

const initialState={
    filters:[]
}

function filterReducer(state=initialState,action){
 switch(action.type){
     case GET_FILTERS:
         return state;

         case SET_FILTERS:
             return{
                 ...state,
                 filters: action.payload
             }

            default:
                return state;
 }
}



export default filterReducer;