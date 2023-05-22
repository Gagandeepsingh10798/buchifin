import { ContactsOutlined, NoteAddTwoTone } from "@material-ui/icons";
import { capitalize } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getNotifications } from "Redux/Actions/Auth";
import { getTrail, getUpdatedNotifications, updateNotifications } from "Redux/Actions/commonCRUD";
import { ICONS, IMAGES, ROUTE_CONSTANTS, STRINGS, titleCase } from "Shared";
import "./header.scss";
import "./style.scss";
function Header_HOC(WrappedComponent) {
  return function HOC() {
    
    return (
      <>
        <header className="header">
          {/* <div className="d-flex justify-content-between hd_lft"> */}
            <a href="/">
              <img src={IMAGES.BFT_LOGO} className="logo" width="90" height="52"  style={{
              objectFit: "scale-down"}}/>
            </a>

            {/* <button
              id="hamburger"
              class="hamburger_menu"
              
              aria-label="Main Menu"
            >
              <svg width="50" height="50" viewBox="0 0 100 100">
                <path
                  class="line line1"
                  d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
                />
                <path class="line line2" d="M 20,50 H 80" />
                <path
                  class="line line3"
                  d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
                />
              </svg>
            </button> */}
          {/* </div> */}
          <div className="hd_rht">
            <div class="custom_dropMenu">
              {/* <div
                className="d-flex align-items-center text-right"
                data-toggle="dropdown"
              > */}
                {/* <div
                  className="bell-icon"
                  onClick={() => bellHandler()}
                >
                  <img
                    src={ICONS.bellIcon}
                  />
                  { notifications?.unreadNotifications ?
                    <div className="noti">
                    <span className="noti-count">
                      {notifications?.unreadNotifications}
                    </span>
                  </div>
                  : null}
                </div> */}

                {/* <div className="d-flex flex-column mr-2 userInfo">
                  <span className="user_name">Diane Ward</span>
                  <span className="user_status ">Admin</span>
                </div> */}
                {/* <div class="avtar"> */}
                  {/* <img
                    className=""
                    src={IMAGES.EQUIPMENT_1}
                    alt="Pic"
                  />
                </div>
              </div> */}

              <div class="dropdown-menu dropdown-menu-right">
                <a href="/" class="dropdown-item" type="button">
                  My Profile
                </a>
                <a class="dropdown-item" type="button">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </header>

        <WrappedComponent />
      </>
    );
  };
}

export default Header_HOC;
