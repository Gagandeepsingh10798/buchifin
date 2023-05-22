import {
  GET_FILTERS,
  GET_CATEGORIES,
  ADD_TRAIL,
  POST_FILTERS,
  UPDATE_STAYEAT,
  GET_FILTERS_BY_LANGUAGE,
} from "Redux/Actions/ActionType";
import { takeLatest, all, put } from "@redux-saga/core/effects";
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
import { setFilter, setCategories } from "Redux/Actions/filterCRUD";
import { startLoader, stopLoader } from "Redux/Actions/commonCRUD";

function* getFilter({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({ API: `${BASE_URL}/v1/admin/filters` });
    yield put(setFilter(response.data.data));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* getFilterByLanguage({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({ API: `${BASE_URL}/v1/admin/filters?language=${data}` });
    if (response.status == 200) {
      yield put(setFilter(response.data.data))
    }
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* getCategories({ data }) {
  try {
    yield put(startLoader());
    const response = yield getRequest({
      API: `${BASE_URL}/v1/admin/categories`,
    });
    yield put(setCategories(response.data.trailCategories));
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* postFilter({ data, callback }) {
  try {
    yield put(startLoader());
    const response = yield postRequest({
      API: `${BASE_URL}/v1/admin/filters`,
      DATA: data,
    });
    if (response.status === 400) {
      callback(response.data.msg, "error");
    } else if (response.status === 401) {
      callback(response.data.msg, "error");
    } else if (response.status === 200) {
      callback("Filters Updated Successfully", "success");
    } else {
      callback("Something went wrong", "error");
    }
  } catch (error) {
    console.log("Error Occured");
  } finally {
    yield put(stopLoader());
  }
}

function* updateStayEat({ data, callback }) {
  let stayEatData = { ...data };
  delete data.id;
  try {
    yield put(startLoader());
    const response = yield putRequest({
      API: `${BASE_URL}/v1/admin/stay/eat/${stayEatData?.id}`,
      DATA: data,
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

function* filterSagaWatcher() {
  yield all([
    takeLatest(GET_FILTERS, getFilter),
    takeLatest(GET_CATEGORIES, getCategories),
    takeLatest(POST_FILTERS, postFilter),
    takeLatest(UPDATE_STAYEAT, updateStayEat),
    takeLatest(GET_FILTERS_BY_LANGUAGE,getFilterByLanguage)
  ]);
}

export default filterSagaWatcher;
