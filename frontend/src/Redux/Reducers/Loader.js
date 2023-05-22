
import {START_LOADER, STOP_LOADER} from "../Actions/ActionType"

const initialState={
    loading: false
}

function loaderReducer(state=initialState,action){
 switch(action.type){

    case START_LOADER:
        return {
            ...state,
            loading: true
        }
     case STOP_LOADER:
        return {
            ...state,
            loading: false
        }

        default:
            return state;
 }
}

export default loaderReducer;