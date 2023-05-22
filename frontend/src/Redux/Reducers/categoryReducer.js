import{GET_CATEGORIES,SET_CATEGORIES} from "../Actions/ActionType"

const initialState={
    category:[]
}

function categoryReducer(state=initialState,action){
    
    switch(action.type){
        case GET_CATEGORIES:
            return state;

            case SET_CATEGORIES:
                return {
                    ...state,
                    category: action.payload
                }
   
               default:
                   return state;
    }
}

export default categoryReducer;