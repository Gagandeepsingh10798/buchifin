import { DELETE_EQUIPMENTS, GET_EQUIPMENTS, GET_NOTIFICATIONS, POST_NOTIFICATIONS, POST_PROFILES, RESEND_OTP, RESET_PASSWORD, SEND_OTP, SET_AUTHTOKEN, SET_EMAIL, SET_MULTIPLE_IMAGES, SET_USER_ID, SORT_IMAGE, VERIFY_OTP } from "./ActionType";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const login = (payload, callback) => {
  return {
    type: LOGIN,
    payload,
    callback,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const setAuthToken = (data) => {
  return {
    type: SET_AUTHTOKEN,
    data,
  };
};

export const sendOtp=(data,callback)=>{
  return{
    type: SEND_OTP,
    data,
    callback
  }
}

export const setEmail=(data)=>{
  return{
    type: SET_EMAIL,
    data
  }
}

export const verifyOtp=(data,callback)=>{
  return{
    type: VERIFY_OTP,
    data,
    callback
  }
}

export const setUserId=(data,callback)=>{
  return{
    type:SET_USER_ID,
    data,
    callback
  }
}

export const resetPassword=(data,callback)=>{
  return{
    type: RESET_PASSWORD,
    data,
    callback
  }
}

export const resendOtp=(data,callback)=>{
  return{
    type: RESEND_OTP,
    data,
    callback
  }
}

export const setMultipleImages=(payload)=>{
  return{
    type: SET_MULTIPLE_IMAGES,
    payload
  }
}

export const getNotifications=(payload)=>{
  return{
    type: GET_NOTIFICATIONS,
    payload
  }
}

export const postNotifications=(data)=>{
  return{
    type: POST_NOTIFICATIONS,
    data
  }
}

export const sortImage=(data,callback)=>{
  return{
    type: SORT_IMAGE,
    data,
    callback
  }
}

