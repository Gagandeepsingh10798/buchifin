import{GET_EQUIPMENTS, SET_EQUIPMENTS} from "../Actions/ActionType"

const initialState={
    equipments:[]
}

function equipmentsReducer(state=initialState,action){
    
    switch(action.type){
        case GET_EQUIPMENTS:
            return state;

            case SET_EQUIPMENTS:
                return {
                    ...state,
                    equipments: action.payload
                }
   
               default:
                   return state;
    }
}

export default equipmentsReducer;