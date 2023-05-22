import {
  ADD_STAY_EAT,
  ADD_TRAIL,
  APPROVE_IMAGE,
  DELETE_CATEGORY,
  DELETE_DAYS_OUT,
  DELETE_EQUIPMENTS,
  DELETE_OTHER_FACILITIES,
  DELETE_PHOTOS,
  DELETE_PROFILE,
  DELETE_REVIEW,
  DELETE_STAY_EAT,
  DELETE_TRAIL,
  DENY_IMAGE,
  GET_ACTIVITY,
  GET_DAYS_OUT,
  GET_DAYS_OUT_DETAILS,
  GET_EQUIPMENTS,
  GET_IMAGE_URL,
  GET_NOTIFICATIONS,
  GET_OTHER_FACILITIES,
  GET_PROFILES,
  GET_STAY_EAT_DETAILS,
  GET_STAY_HOME,
  GET_TRAIL,
  GET_TRAILS,
  GET_TRAIL_BY_LANGUAGE,
  GET_UPDATED_NOTIFICATIONS,
  MULTIPLE_FILE_UPLOAD,
  POST_ACTIVITY,
  POST_CATEGORIES,
  POST_DAYS_OUT,
  POST_EQUIPMENTS,
  POST_OTHER_FACILITIES,
  POST_PROFILES,
  SET_PROFILES,
  SORT_CATEGORIES,
  SORT_DAYSOUT,
  SORT_IMAGE,
  UPDATE_ACTIVITY,
  UPDATE_CATEGORY,
  UPDATE_DAYSOUT,
  UPDATE_EQUIPMENTS,
  UPDATE_NOTIFICATIONS,
  UPDATE_STAYEAT,
  UPDATE_TRAIL,
  UPLOAD_FILE,
  UPLOAD_MULTIPLE_IMAGES,
} from "Redux/Actions/ActionType";
import {
  takeLatest,
  takeEvery,
  all,
  put,
  call,
} from "@redux-saga/core/effects";
import {
  STRINGS,
  STATUS,
  STATUS_CODE,
  getRequest,
  postRequest,
  deleteRequest,
  putRequest,
  BASE_URL,
} from "Shared";
import {
  setActivity,
  setAttractionsNearby,
  setBikeRepair,
  setCurrrentStayEat,
  setDaysOut,
  setDaysOutDetails,
  setEquipments,
  setGarages,
  setLocation,
  setNotifications,
  setProfiles,
  setPublicTransport,
  setStayHome,
  setTrail,
  settrails,
  startLoader,
  stopLoader,
  updateStayEat,
} from "Redux/Actions/commonCRUD";
import { useDispatch, useSelector } from "react-redux";
import { ControlPointSharp, InfoRounded } from "@material-ui/icons";


function* addtrail({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/home`,
      DATA: data,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
      yield put(stopLoader());
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
      yield put(stopLoader());
    } else if (response.status === 200) {
      callback(response.data.msg, "success");
      yield put(stopLoader());
    }
  } catch (error) {}
}

function* uploadfile({ data, callback }) {
  const formdata = new FormData();
  formdata.append("file", data.file);
  formdata.append("type", data.id);

  try {
    const response = yield postRequest({
      API: `${BASE_URL}/v1/file/upload`,
      DATA: formdata,
    });

    callback(response.data.fileUrl);
  } catch (error) {
    console.log(error);
  }
}

function* multipleFileUpload({ data, callback }) {

  const formdata = new FormData();
  for(let i=0;i<data.file.length;i++){
   formdata.append("fileArray", data.file[i]);
  }
  
  try {
    const response = yield postRequest({
      API: `${BASE_URL}/v1/files/upload`,
      DATA: formdata,
    });

    callback(response.data);
  } catch (error) {
    console.log(error);
  }
}

function* addStayEat({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/stay/eat`,
      DATA: data,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Added Successfully", "success");
    } else {
      callback("Something went wrong", "error");
    }
  } catch (error) {
    //do nothing
  } finally {
    yield put(stopLoader());
  }
}

function* uploadMultipleImages({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/user/trail/image`,
      DATA: data,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Images Uploaded Successfully", "success");
    } else {
      callback("Something went wrong", "error");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* postDaysOut({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/days/out`,
      DATA: data,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback(response.data.msg, "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* updateDaysOut({ data, callback }) {
  let formData = {
    name: data?.name,
    image: data?.image,
    webLink: data?.webLink,
    profileType: data?.profileType
  };
  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/admin/days/out/${data?.id}`,
      DATA: formData,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* gettrails({ data }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/trails`,
      DATA: { limit: "20" },
    });
    yield put(settrails(response.data.trail));
  } catch (error) {
  } finally {
    yield put(stopLoader());
  }
}

function* getActivity({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/filters/actvities`,
    });

    yield put(setActivity(response.data.data));
  } catch (error) {
  } finally {
    yield put(stopLoader());
  }
}

function* postCategories({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/categories`,
      DATA: data,
    });
    console.log(response);
    if (response.status === 400) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 200) {
      callback("Category Added Succesfully", "success");
      stopLoader();
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* postActivity({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/filters/actvities`,
      DATA: data,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 200) {
      callback("Activity Added Succesfully", "success");
      stopLoader();
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* deleteCategory({ data, callback }) {
  try {
    yield put(startLoader());

    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/categories/${data}`,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Category Deleted Succesfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* getTrail({ payload,callback }) {
  let data = {
    trailId: payload,
  };
  
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/trails`,
      DATA: data,
    });

    if(response.status==200){
      yield put(setTrail(response.data.trail));
      callback();
    }

  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* getTrailByLanguage({ data }) {
  let languageData = {
    trailId: data.trailId,
    language:data.language
  };
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/trails`,
      DATA: languageData,
    });
    if(response.status==200){
      yield put(setTrail(response.data.trail));
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}


function* getUpdatedNotifications({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/trails`,
      DATA: data,
    });
    console.log(response);
    if (response.status == 200) {
      callback();
      yield put(setTrail(response.data.trail));
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* getLink({ data, callback }) {
  try {
    yield put(startLoader());

    const response = yield getRequest({
      API: `${BASE_URL}/v1/file/{path}?path=${data}`,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback();
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* approveImage({ data, callback }) {
  try {
    // yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/user/trail/image/${data}?isApproved=true`,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Image Approved", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    // yield put(stopLoader());
  }
}

function* denyImage({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/user/trail/image/${data}?isDenied=true`,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Image Denied", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* updateActivity({ data, callback }) {
  let activity = {
    name: data.name,
  };

  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/admin/filters/actvities/${data?.id}`,
      DATA: activity,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* updateCategory({ data, callback }) {
  let category = {
    name: data.name,
  };

  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/categories/${data?.id}`,
      DATA: category,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* deleteTrail({ data, callback }) {
  try {
    yield put(startLoader());

    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/admin/${data}`,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Trail Deleted Successfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* deleteReview({ data, callback }) {
  console.log(data);
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/user/trail/reviews/${data}`,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Review Deleted Successfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* deletePhotos({ data, callback }) {
  console.log(data);
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/user/trail/image/${data}`,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Image Deleted Successfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* updateTrail({ data, callback }) {
  let trailData = { ...data };
  delete data.id;

  try {
    yield put(startLoader());
    console.log(data);
    const response = yield putRequest({
      API: `${BASE_URL}/v1/admin/${trailData.id}`,
      DATA: data,
    });
    console.log(response);

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* postEquipments({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/equipments`,
      DATA: data,
    });
    console.log(response);
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Equipment Added Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* getStayHome({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/stay/eat?limit=${20}`,
    });
    yield put(setStayHome(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* getDaysOut({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/days/out?limit=${20}`,
    });

    yield put(setDaysOut(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* getOtherFacilities({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/trail/other/facilities?facilityType=${data}`,
    });

    if(data===1){
      yield put(setAttractionsNearby(response.data.data))
    }
    else if(data===2){
      yield put(setGarages(response.data.data))
    }
    else if(data===3){
      yield put(setPublicTransport(response.data.data))
    }
    else{
      yield put(setBikeRepair(response.data.data))
    }
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* getStayEatDetails({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/stay/eat?id=${data}`,
    });

    yield put(setCurrrentStayEat(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* deleteStayEat({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/admin/stay/eat/${data}`,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Deleted Successfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* getDaysOutDetails({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/days/out?id=${data}`,
    });
    console.log(response)
    yield put(setDaysOutDetails(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* getEquipments({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/equipments`,
    });
    yield put(setEquipments(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* postProfiles({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/trail/profile`,
      DATA: data,
    });
    console.log(response);
    if (response.status === 400) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 200) {
      callback(response.data.msg, "success");
      stopLoader();
    }
  } catch (error) {
    console.log(error);
  }
  finally{
    yield put(stopLoader())
  }
}

function* postOtherFacilities({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/trail/other/facilities`,
      DATA: data,
    });
    console.log(response);
    if (response.status === 400) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
      stopLoader();
    } else if (response.status === 200) {
      callback(response.data.msg, "success");
      stopLoader();
    }
  } catch (error) {
    console.log(error);
  }
  finally {
    yield put(stopLoader());
  }
}

function* deleteDaysOut({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/admin/days/out/${data}`,
    });
    console.log(response);
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Deleted Successfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* getProfiles({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/trail/profile`,
    });
    console.log(response);
    yield put(setProfiles(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* deleteProfile({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/trail/profile/${data}`,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Deleted Successfully", "success");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* deleteOtherFacilities({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/trail/other/facilities?id=${data}`,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Deleted Successfully", "success");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* getNotifications({ data }) {
  try {
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/trail/images/notifications`,
    });
    yield put(setNotifications(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  }
}

function* updateNotifications({ data, callback }) {
  try {
    const response = yield putRequest({
      API: `${BASE_URL}/v1/admin/trail/images/notifications`,
    });

    if (callback) {
      if (response.status === 200) {
        callback();
      } else {
        console.log("Error");
      }
    }
  } catch (error) {
    console.log("Error");
  }
}

function* deleteEquipments({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield deleteRequest({
      API: `${BASE_URL}/v1/equipments/${data}`,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Equipment Deleted Succesfully", "success");
    }
  } catch (error) {
    console.log("Error");
  } finally {
    yield put(stopLoader());
  }
}

function* sortImage({ data, callback }) {
  let sortData = {
    imagesSort: data?.data,
  };
  try {
    yield put(startLoader());
    console.log(data);
    const response = yield putRequest({
      API: `${BASE_URL}/v1/trail/images/sort/?trailId=${data?.id}`,
      DATA: sortData,
    });
    console.log(response);
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* sortCategories({ data, callback }) {
  let sortData = {
    categorySort: data?.data,
  };

  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/trail/images/sort`,
      DATA: sortData,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* sortDaysOut({ data, callback }) {
  let sortData = {
    daysOutSort: data?.data,
  };

  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/trail/images/sort`,
      DATA: sortData,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* updateEquipments({ data, callback }) {
  let equipmentData = {
    name: data?.name,
    image: data?.image,
  };
  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/equipments/${data?.id}`,
      DATA: equipmentData,
    });

    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Updated Succesfully", "success");
    } else {
      callback("Something Went Wrong", "error");
    }
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoader());
  }
}

function* commonSagaWatcher() {
  yield all([
    takeEvery(UPLOAD_FILE, uploadfile),
    takeLatest(ADD_TRAIL, addtrail),
    takeLatest(GET_TRAILS, gettrails),
    takeLatest(ADD_STAY_EAT, addStayEat),
    takeLatest(POST_DAYS_OUT, postDaysOut),
    takeLatest(POST_CATEGORIES, postCategories),
    takeLatest(DELETE_CATEGORY, deleteCategory),
    takeLatest(GET_TRAIL, getTrail),
    takeLatest(GET_IMAGE_URL, getLink),
    takeLatest(UPDATE_CATEGORY, updateCategory),
    takeLatest(DELETE_TRAIL, deleteTrail),
    takeLatest(UPDATE_TRAIL, updateTrail),
    takeLatest(DELETE_REVIEW, deleteReview),
    takeLatest(DELETE_PHOTOS, deletePhotos),
    takeLatest(GET_STAY_HOME, getStayHome),
    takeLatest(GET_STAY_EAT_DETAILS, getStayEatDetails),
    takeLatest(DELETE_STAY_EAT, deleteStayEat),
    takeLatest(GET_DAYS_OUT, getDaysOut),
    takeLatest(GET_DAYS_OUT_DETAILS, getDaysOutDetails),
    takeLatest(DELETE_DAYS_OUT, deleteDaysOut),
    takeLatest(GET_EQUIPMENTS, getEquipments),
    takeLatest(POST_EQUIPMENTS, postEquipments),
    takeLatest(UPLOAD_MULTIPLE_IMAGES, uploadMultipleImages),
    takeLatest(POST_PROFILES, postProfiles),
    takeLatest(GET_PROFILES, getProfiles),
    takeLatest(DELETE_PROFILE, deleteProfile),
    takeLatest(GET_NOTIFICATIONS, getNotifications),
    takeLatest(UPDATE_NOTIFICATIONS, updateNotifications),
    takeLatest(GET_UPDATED_NOTIFICATIONS, getUpdatedNotifications),
    takeLatest(APPROVE_IMAGE, approveImage),
    takeLatest(DENY_IMAGE, denyImage),
    takeLatest(DELETE_EQUIPMENTS, deleteEquipments),
    takeLatest(GET_ACTIVITY, getActivity),
    takeLatest(POST_ACTIVITY, postActivity),
    takeLatest(UPDATE_ACTIVITY, updateActivity),
    takeLatest(SORT_IMAGE, sortImage),
    takeLatest(UPDATE_EQUIPMENTS, updateEquipments),
    takeLatest(UPDATE_DAYSOUT, updateDaysOut),
    takeEvery(MULTIPLE_FILE_UPLOAD, multipleFileUpload),
    takeLatest(POST_OTHER_FACILITIES,postOtherFacilities),
    takeLatest(GET_OTHER_FACILITIES,getOtherFacilities),
    takeLatest(DELETE_OTHER_FACILITIES,deleteOtherFacilities),
    takeLatest(SORT_CATEGORIES,sortCategories),
    takeLatest(SORT_DAYSOUT,sortDaysOut),
    takeLatest(GET_TRAIL_BY_LANGUAGE,getTrailByLanguage)
  ]);
}

export default commonSagaWatcher;
