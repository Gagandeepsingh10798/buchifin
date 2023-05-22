import { all, fork } from "redux-saga/effects";

import watchAuth from "./Auth";
import filterSagaWatcher from "./filterCRUD";
import commonSagaWatcher from "./commonCRUD";



function* rootSaga() {
  yield all([fork(watchAuth),fork(commonSagaWatcher),fork(filterSagaWatcher)]);
}

export default rootSaga;
