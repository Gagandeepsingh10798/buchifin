
import {SET_MULTIPLE_IMAGES} from "../Actions/ActionType"

const initialState={
    multiple_images:[]
}

function ImageReducer(state=initialState,action){
 switch(action.type){

         case SET_MULTIPLE_IMAGES:
             return{
                 ...state,
                 multiple_images: action.payload
             }

            default:
                return state;
 }
}



export default ImageReducer;