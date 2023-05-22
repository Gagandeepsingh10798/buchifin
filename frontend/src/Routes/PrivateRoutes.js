import Edit_StayEat from "Views/Authenticated/Edit_StayEat";
import { ROUTE_CONSTANTS } from "Shared/Routes";
import Edit_Days_Out from "Views/Authenticated/Edit_Daysout";
import Trails from "Views/Authenticated/Trails";
import { ADD_TRAIL } from "Redux/Actions/ActionType";
import Add_Trail_Screen from "Views/Authenticated/Add_Trail";

export const PRIVATE_ROUTES = [
  {
  path : ROUTE_CONSTANTS.ADMIN_TRAILS,
  component: Trails,
  title: "Trails"
  },
  {
    path: ROUTE_CONSTANTS.ADMIN_ADD_TRAIL,
    component: Add_Trail_Screen,
    title: "Add Retailer"
  },
  
];
