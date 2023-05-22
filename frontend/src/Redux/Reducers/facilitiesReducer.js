import{GET_OTHER_FACILITIES, SET_BIKE_REPAIR, SET_CURRENT_BIKE_REPAIR, SET_CURRENT_GARAGE, SET_CURRENT_NEARBY_ATTRACTION, SET_CURRENT_PUBLIC_TRANSPORT, SET_GARAGES, SET_NEARBY_ATTRACTIONS, SET_OTHER_FACILITIES, SET_PUBLIC_TRANSPORT} from "../Actions/ActionType"

const initialState={
    facilities:[],
    nearbyAttractions:[],
    publicTransport:[],
    garages:[],
    bikeRepair:[],
    currentNearbyAttraction:{},
    currentPublicTransport:{},
    currentGarage:{},
    currentBikeRepair:{}
}

function facilitiesReducer(state=initialState,action){
    
    switch(action.type){
        case GET_OTHER_FACILITIES:
            return state;
        case SET_OTHER_FACILITIES:
            return{
                ...state,
                facilities:action.payload
            }
            case SET_NEARBY_ATTRACTIONS:
                return {
                    ...state,
                    nearbyAttractions: action.payload
                }
            
            case SET_PUBLIC_TRANSPORT:{
                return{
                    ...state,
                    publicTransport:action.payload
                }
            }

            case SET_BIKE_REPAIR:{
                return{
                    ...state,
                    bikeRepair:action.payload
                }
            }

            case SET_GARAGES:{
                return{
                    ...state,
                    garages:action.payload
                }
            }

            case SET_CURRENT_NEARBY_ATTRACTION:{
                
                return{
                    ...state,
                    currentNearbyAttraction:action.payload
                }
            }

            case SET_CURRENT_BIKE_REPAIR:{
                return{
                    ...state,
                    currentBikeRepair:action.payload
                }
            }

            case SET_CURRENT_GARAGE:{
                return{
                    ...state,
                    currentGarage:action.payload
                }
            }

            case SET_CURRENT_PUBLIC_TRANSPORT:{
                return{
                    ...state,
                    currentPublicTransport:action.payload
                }
            }
   
               default:
                   return state;
    }
}

export default facilitiesReducer;