import { takeLatest, all,put } from "redux-saga/effects";
import { LOGIN, LOGOUT, setAuthToken, setUserId } from "../Actions/Auth";
import { login, logout } from "Services/Api/Auth";
import requestSaga from "Shared/RequestSaga";
import { BASE_URL, postRequest, updateAuthToken } from "Shared";
import { RESEND_OTP, RESET_PASSWORD, SEND_OTP, VERIFY_OTP } from "Redux/Actions/ActionType";
import { startLoader, stopLoader } from "Redux/Actions/commonCRUD";
import { yellow } from "@mui/material/colors";
import { STATUS_CODES } from "Services/Api/Constants";

function* loginAuth({payload,callback}) {
  
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/login`,
      DATA: payload,
    });
  
    if(response.status===200){
      yield put(stopLoader());
      callback(response.data.message, "success");
      updateAuthToken(response.data.result.authToken);
      yield put(setAuthToken(response.data.result.authToken));
    }
  } catch (error) {
    callback(error.response.data.message, "error");
      yield put(stopLoader());
  }
}

function* sendOtp({data,callback}) {
 
  try {
    yield put(startLoader());

    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/password/forgot`,
      DATA: data,
    });

   if(response.status===STATUS_CODES.SUCCESS){
      callback(response.data.message, "success");
    }
    
  } catch (error) {
    callback(error.response.data.message, "error");
    console.log(error);
  }
  finally{
    yield put(stopLoader())
  }
}

function* verifyOtp({data,callback}) {
 
  try {
    yield put(startLoader())
    const response = yield postRequest({
      API: "{BASE_URL}/v1/admin/verifyOtp",
      DATA: data,
    });
    if(response.status===400){
      callback(response.data.msg, "error");
    }
    else if(response.status===401){
      callback(response.data.msg, "error");
    }
    else if(response.status===200){
      yield put(setUserId(response.data.user._id))
      callback(response.data.msg, "success");
    }

  } catch (error) {
    console.log(error);
  }
  finally{
    yield put(stopLoader());
  }
}

function* resendOtp({data,callback}) {
 
  try {
   yield put(startLoader())
    const response = yield postRequest({
      API: "{BASE_URL}/v1/admin/resendCode",
      DATA: data,
    });
    
    if(response.status===400){
      callback(response.data.msg, "error");
    }
    else if(response.status===401){
      callback(response.data.msg, "error");
    }
    else if(response.status===200){
      callback("Sent Successfully", "success");
    }

  } catch (error) {
    console.log(error);
  }
  finally{
    yield put(stopLoader());
  }
}


function* resetPassword({data,callback}) {
 delete data.userId;
  try {
    yield put(startLoader())
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/password/reset`,
      DATA: data,
    });
  
    if(response.status===200){
      callback(response.data.message, "success");
    }

  } catch (error) {
    callback(error.response.data.message, "error");

    console.log(error);
  }
  finally{
    yield put(stopLoader())
  }
}



function* watchAuth() {
  yield all([
    takeLatest(LOGIN,loginAuth),
    takeLatest(SEND_OTP,sendOtp),
    takeLatest(VERIFY_OTP,verifyOtp),
    takeLatest(RESET_PASSWORD,resetPassword),
    takeLatest(RESEND_OTP,resendOtp)
    // takeLatest(LOGOUT, requestSaga, logout),
  ]);
}

export default watchAuth;
