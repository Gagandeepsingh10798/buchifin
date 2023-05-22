import { KeyboardReturnSharp } from "@material-ui/icons";
import { call, retry } from "@redux-saga/core/effects";
import { ADD_TRAIL,GET_TRAILS,UPLOAD_FILE,SET_TRAILS, ADD_STAY_EAT, POST_CATEGORIES, POST_DAYS_OUT, DELETE_CATEGORY, SET_LOCATION, GET_TRAIL, SET_TRAIL, GET_IMAGE_URL, START_LOADER, STOP_LOADER, UPDATE_CATEGORY, DELETE_TRAIL, UPDATE_TRAIL, DELETE_REVIEW, DELETE_PHOTOS, GET_STAY_HOME, SET_STAY_HOME, SET_CURRENT_STAY_HOME, GET_STAY_EAT_DETAILS, DELETE_STAY_EAT, GET_DAYS_OUT, SET_DAYS_OUT, GET_DAYS_OUT_DETAILS, SET_DAYS_OUT_DETAILS, DELETE_DAYS_OUT, GET_EQUIPMENTS, SET_EQUIPMENTS, POST_EQUIPMENTS, UPLOAD_MULTIPLE_IMAGES, GET_PROFILES, SET_PROFILES, DELETE_PROFILE, POST_PROFILES, UPDATE_PROFILE, SET_NOTIFICATIONS, UPDATE_NOTIFICATIONS, GET_UPDATED_NOTIFICATIONS, APPROVE_IMAGE, DENY_IMAGE, DELETE_EQUIPMENTS, GET_ACTIVITY, SET_ACTIVITY, POST_ACTIVITY, UPDATE_ACTIVITY, UPDATE_EQUIPMENTS, UPDATE_DAYSOUT, UPDATe_STAYEAT, UPDATE_STAYEAT, MULTIPLE_FILE_UPLOAD, POST_OTHER_FACILITIES, GET_OTHER_FACILITIES, SET_OTHER_FACILITIES, SET_NEARBY_ATTRACTIONS, SET_GARAGES, SET_PUBLIC_TRANSPORT, SET_BIKE_REPAIR, SET_CURRENT_NEARBY_ATTRACTION, SET_CURRENT_BIKE_REPAIR, SET_CURRENT_PUBLIC_TRANSPORT, SET_CURRENT_GARAGE, DELETE_OTHER_FACILITIES, SORT_CATEGORIES, SORT_DAYSOUT, GET_TRAIL_BY_LANGUAGE, GET_FILTERS_BY_LANGUAGE} from "./ActionType";

export const uploadfile=(data,callback)=>{
    return {
        type:UPLOAD_FILE,
        data,
        callback
    }
}

export const updateDaysOut=(data,callback)=>{
    return{
        type: UPDATE_DAYSOUT,
        data,
        callback
    }
}

export const addStayEat=(data,callback)=>{
    return{
        type:ADD_STAY_EAT,
        data,
        callback
    }
}

export const addtrail=(data,callback)=>{
    return{
        type: ADD_TRAIL,
        data,
        callback
    }
    }

export const gettrails=(data)=>{
   
    return{
        type:GET_TRAILS,
        data
    }
}

export const settrails=(payload)=>{
    return{
        type:SET_TRAILS,
        payload
    }
}

export const postCategories=(data,callback)=>{
    return{
        type:POST_CATEGORIES,
        data,
        callback
    }
}

export const postDaysOut=(data,callback)=>{
    return{
        type:POST_DAYS_OUT,
        data,
        callback
    }
}

export const deleteCategory=(data,callback)=>{
    return{
        type:DELETE_CATEGORY,
        data,
        callback
    }
}

export const setLocation=(payload)=>{
    console.log(payload)
    return{
        type:SET_LOCATION,
        payload
    }
}

export const getTrail=(payload,callback)=>{
    return{
        type:GET_TRAIL,
        payload,
        callback
    }
}

export const setTrail=(data)=>{
   
return{
    type:SET_TRAIL,
    data
}
}

export const getLink=(data,callback)=>{
    return{
        type: GET_IMAGE_URL,
        data,
        callback
    }
}

export const startLoader = () => {
    return {
        type: START_LOADER,
        
    }
}

export const stopLoader = () => {
    return {
        type: STOP_LOADER,
        

    }
}

export const updateCategory=(data,callback)=>{
    return{
        type:UPDATE_CATEGORY,
        data,
        callback
    }
}

export const deleteTrail=(data,callback)=>{
    return{
        type: DELETE_TRAIL,
        data,
        callback
    }
}


export const updateTrail=(data,callback)=>{
    return{
        type: UPDATE_TRAIL,
        data,
        callback
    }
}

export const deleteReview=(data,callback)=>{
    return{
        type: DELETE_REVIEW,
        data,
        callback
    }
}

export const deletePhotos=(data,callback)=>{
    return{
        type: DELETE_PHOTOS,
        data,
        callback
    }
}

export const getStayHome=(data)=>{
    return{
        type: GET_STAY_HOME,
        data
    }
}

export const setStayHome=(payload)=>{
    return{
        type: SET_STAY_HOME,
        payload
    }
}
export const setCurrrentStayEat=(payload)=>{
    
    return{
        type: SET_CURRENT_STAY_HOME,
        payload
    }
}

export const getStayEatDetails=(data)=>{
    return{
        type: GET_STAY_EAT_DETAILS,
        data
    }
}

export const deleteStayEat=(data,callback)=>{
    return{
        type: DELETE_STAY_EAT,
        data,
        callback
    }
}

export const getDaysOut=(data)=>{
    return{
        type: GET_DAYS_OUT,
        data
    }
}

export const setDaysOut=(payload)=>{
    return{
        type : SET_DAYS_OUT,
        payload
    }
}

export const getDaysOutDetails=(data)=>{
    
    return{
        type: GET_DAYS_OUT_DETAILS,
        data
    }
}

export const setDaysOutDetails=(payload)=>{
    return{
        type : SET_DAYS_OUT_DETAILS,
        payload
    }
}

export const deleteDaysOut=(data,callback)=>{
    return{
        type: DELETE_DAYS_OUT,
        data,
        callback
    }
}

export const getEquipments=(data)=>{
    return{
        type: GET_EQUIPMENTS,
        data 
    }
}

export const setEquipments=(payload)=>{
    return{
        type: SET_EQUIPMENTS,
        payload
    }
}

export const postEquipments=(data,callback)=>{
    return{
        type: POST_EQUIPMENTS,
        data,
        callback
    }
}

export const uploadMultipleImages=(data,callback)=>{
    return{
        type: UPLOAD_MULTIPLE_IMAGES,
        data,
        callback
    }
}

export const getProfiles=(data)=>{
    return{
        type: GET_PROFILES,
        data
    }
}

export const setProfiles=(payload)=>{
    return{
        type: SET_PROFILES,
        payload
    }
}

export const deleteProfiles=(data,callback)=>{
    return{
        type: DELETE_PROFILE,
        data,
        callback
    }
}

export const postProfiles=(data,callback)=>{
    return{
        type: POST_PROFILES,
        data,
        callback
    }
}

export const updateProfiles=(data,callback)=>{
    return{
        type: UPDATE_PROFILE,
        data,
        callback
    }
}

export const setNotifications=(payload)=>{
    return{
        type: SET_NOTIFICATIONS,
        payload
    }
}

export const updateNotifications=(data,callback)=>{
    return{
        type: UPDATE_NOTIFICATIONS,
        data,
        callback
    }
}

export const getUpdatedNotifications=(data,callback)=>{
    return{
        type: GET_UPDATED_NOTIFICATIONS,
        data,
        callback
    }
}

export const approveImage=(data,callback)=>{
    return{
        type:APPROVE_IMAGE,
        data,
        callback
    }
}

export const denyImage=(data,callback)=>{
    return{
        type: DENY_IMAGE,
        data,
        callback
    }
}

export const deleteEquipments=(data,callback)=>{
    return{
      type: DELETE_EQUIPMENTS,
      data,
      callback
    }
  }

  export const getActivity=(data)=>{
      return{
          type: GET_ACTIVITY,
          data
      }
  }

  export const setActivity=(payload)=>{
      return{
          type: SET_ACTIVITY,
          payload
      }
  }

  export const postActivity=(data,callback)=>{
      return{
          type: POST_ACTIVITY,
          data,
          callback
      }
  }

  export const updateActivity=(data,callback)=>{
      return{
          type: UPDATE_ACTIVITY,
          data,
          callback
      }
  }

  export const updateEquipments=(data,callback)=>{
      return{
          type: UPDATE_EQUIPMENTS,
          data,
          callback
      }
  }

  export const updateStayEat=(data,callback)=>{
      return{
          type: UPDATE_STAYEAT,
          data,
          callback
      }
  }

  export const multipleFileUpload=(data,callback)=>{
      return{
          type: MULTIPLE_FILE_UPLOAD,
          data,
          callback
      }
  }

  export const postOtherFacilities=(data,callback)=>{
      return{
          type: POST_OTHER_FACILITIES,
          data,
          callback
      }
  }

  export const getOtherFacilities=(data)=>{
      return{
          type: GET_OTHER_FACILITIES,
          data
      }
  }

  export const setOtherFacilities=(payload)=>{
      return{
          type:SET_OTHER_FACILITIES,
          payload
      }
  }

  export const setAttractionsNearby=(payload)=>{
      return{
          type: SET_NEARBY_ATTRACTIONS,
          payload
      }
  }

  export const setGarages=(payload)=>{
      return{
          type: SET_GARAGES,
          payload
      }
  }

  export const setPublicTransport=(payload)=>{
      return{
          type: SET_PUBLIC_TRANSPORT,
          payload
      }
  }

  export const setBikeRepair=(payload)=>{
      return{
          type: SET_BIKE_REPAIR,
          payload
      }
  }

  export const setCurrentNearbyAttraction=(payload)=>{
     
    return{
        type: SET_CURRENT_NEARBY_ATTRACTION,
        payload
    }
}

export const setCurrentBikeRepair=(payload)=>{
    return{
        type: SET_CURRENT_BIKE_REPAIR,
        payload
    }
}

export const setCurrentPublicTransport=(payload)=>{
    return{
        type: SET_CURRENT_PUBLIC_TRANSPORT,
        payload
    }
}

export const setCurrentGarage=(payload)=>{
    return{
        type: SET_CURRENT_GARAGE,
        payload
    }
}

export const deleteOtherFacilities=(data,callback)=>{
    return{
        type: DELETE_OTHER_FACILITIES,
        data,
        callback
    }
}

export const sortCategories=(data,callback)=>{
    return{
        type: SORT_CATEGORIES,
        data,
        callback
    }
}

export const sortDaysOut=(data,callback)=>{
    return{
        type: SORT_DAYSOUT,
        data,
        callback
    }
}

export const getTrailByLanguage=(data,callback)=>{
   
    return{
        type: GET_TRAIL_BY_LANGUAGE,
        data,
        callback
    }
}

export const getFilterByLanguage=(data,callback)=>{
    return{
        type: GET_FILTERS_BY_LANGUAGE,
        data,
        callback
    }
}