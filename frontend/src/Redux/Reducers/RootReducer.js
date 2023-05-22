import { combineReducers } from "redux";

import authReducer from "./Auth";
import loadingReducer from "./Api/LoadingReducer";
import errorReducer from "./Api/ErrorReducer";
import { LOGOUT } from "../Actions/Auth";
import { ACTION_STATES } from "../Actions/ActionStates";
import filterReducer from "./filterReducer";
import categoryReducer from "./categoryReducer";
import trailReducer from "./trailReducer";
import locationReducer from "./locationReducer";
import trailInfoReducer from "./trailInfoReducer";
import emailReducer from "./SetEmail";
import userIDReducer from "./setUser";
import loaderReducer from "./Loader";
import StayEatReducer from "./StayEatReducer";
import StayEatDetailsReducer from "./stayEatDetailsReducer";
import DaysOutReducer from "./DaysOutReducer";
import DaysOutDetailsReducer from "./DaysOutDetailsReducer";
import equipmentsReducer from "./equipmentsReducer";
import ImageReducer from "./ImagesReducer";
import profileReducer from "./profileReducer";
import NotificationReducer from "./NotificationReducer";
import activityReducer from "./activityReducer";
import facilitiesReducer from "./facilitiesReducer";

const appReducer = combineReducers({
  loading: loadingReducer,
  error: errorReducer,
  
});

const rootReducer = combineReducers({
  auth: authReducer,
  filter:filterReducer,
  category:categoryReducer,
  trails:trailReducer,
  location:locationReducer,
  current_trail:trailInfoReducer,
  email:emailReducer,
  userID:userIDReducer,
  loading:loaderReducer,
  stayEat:StayEatReducer,
  currentStayEat:StayEatDetailsReducer,
  daysOut: DaysOutReducer,
  currentDaysOut: DaysOutDetailsReducer,
  equipments: equipmentsReducer,
  multipleImages:ImageReducer,
  profiles:profileReducer,
  notifications:NotificationReducer,
  activity: activityReducer,
  facilities:facilitiesReducer
});

export default rootReducer;
