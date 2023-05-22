import { Icon } from "@mui/material";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { setAuthToken } from "Redux/Actions/Auth";
import { ROUTE_CONSTANTS, updateAuthToken } from "Shared";
import { IMAGES } from "Shared";
import "./style.scss";

function NavBarHOC(WrappedComponent) {
  return function HOC(props) {
    const history = useHistory();
    const dispatch = useDispatch();
    const logoutHandler = () => {

      updateAuthToken("");
      dispatch(setAuthToken(""));
      history.push(ROUTE_CONSTANTS.LOGIN);

    }
    return (
      <>
      
        <aside className="left_sidebar">
          <ul className="main_menu" onClick={()=>document.querySelector(".left_sidebar").classList.remove("active")} >
            <li>
              <a href="javascript:void(0)"
                onClick={() =>
                  history.push(ROUTE_CONSTANTS.ADMIN_TRAILS)
                }
              >
                <i><img src={IMAGES.CategoriesIcon} alt="Categories" /></i> Retailers
              </a>
            </li>
            {/* <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.ADMIN_TRAILS)}
              >
                <i><img src={IMAGES.TrailIcon} alt="Trails" /></i> Trails
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.ADMIN_ADD_FILTERS)}
              >
                <i><img src={IMAGES.FilterIcon} alt="Filter" /></i> Filter
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() =>
                  history.push(ROUTE_CONSTANTS.STAY_HOME)
                }
              >
                <i><img src={IMAGES.stayEatIcon} alt="Stay Eat" /></i> Stay or Eat
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.DAYS_OUT_HOME)}
              >
                <i><img src={IMAGES.daysOutIcon} alt="Days Out" /></i> Days Out
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.ACTIVITY)}
              >
               <i><img src={IMAGES.activityIcon} alt="Categories" /></i> Activity
              </a>
            </li>

            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.PROFILE)}
              >
               <i><img src={IMAGES.profileIcon} alt="Profiles" /></i> Profile
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.EQUIPMENTS)}
              >
               <i><img src={IMAGES.equipmentIcon} alt="Equipments" /></i> Equipment
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.NEARBY_ATTRACTIONS_HOME)}
              >
               <i><img src={IMAGES.attractions_nearby_icon} alt="Nearby Attractions" /></i>Nearby Attractions 
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.GARAGES_HOME)}
              >
               <i><img src={IMAGES.garages_icon} alt="Garages" /></i> Garages
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.BIKE_REPAIR_HOME)}
              >
               <i><img src={IMAGES.bike_repar_icon} alt="Bike Repairs" /></i> Bike Repairs
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.PUBLIC_TRANSPORT_HOME)}
              >
               <i><img src={IMAGES.public_transport_icon} alt="Public Transport" /></i> Public Transport
              </a>
            </li> */}
            {/* <li>
              <a href="javascript:void(0)"
                onClick={() => history.push(ROUTE_CONSTANTS.PROFILE)}
              >
               <i><img src={IMAGES.emergency_numbers_icon} alt="Emergency Numbers" /></i> Emergency Numbers
              </a>
            </li> */}
            
          </ul>

          <a href="javascript:void(0);" className="logout_btn" onClick={() => logoutHandler()}>
            <i><img src={IMAGES.LogoutIcon} alt="Logout" /></i> Logout
          </a>
        </aside>

        {/* Right Panel */}
        <div className="main-content">
          <div className="content-wrap">
            <WrappedComponent />
          </div>
        </div>
      </>
    );
  };
}

export default NavBarHOC;
