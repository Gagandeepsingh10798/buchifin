import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { updateAuthToken } from "Shared/Axios";
import AppLayout from "Components/Core/AppLayout";
import { AUTH_ROUTES } from "./AuthRoutes";
import { PUBLIC_ROUTES } from "./PublicRoutes";
import { PRIVATE_ROUTES } from "./PrivateRoutes";
import DocumentTitle from "./DocumentTitle";
import PublicLayout from "Components/Core/PublicLayout";
import PrivateLayout from "Components/Core/PrivateLayout";
import RenderRoutes from "./RenderRoutes";
import Nav_Bar from "Components/hoc/NavBar";
import NavBarHOC from "Components/hoc/NavBar";
import Header_HOC from "Components/hoc/Header";
import Home_Loader from "Components/atoms/Loader";
const DEFAULT_AUTHENTICATED_ROUTE = "/admin/trails";
const DEFAULT_GUEST_ROUTE = "/login";

const GuestRoutes = () => {
  return (
    <Switch>
      <Route exact path={AUTH_ROUTES.map((route) => route.path)}>
        <RenderRoutes routes={AUTH_ROUTES} />
      </Route>
      <Route exact path={PUBLIC_ROUTES.map((route) => route.path)}>
          <RenderRoutes routes={PUBLIC_ROUTES} />
      </Route>
      <Redirect from="*" to={DEFAULT_GUEST_ROUTE} />
    </Switch>
  );
};

const AuthenticatedRoutes = Header_HOC(NavBarHOC(() => {
  const routes = PUBLIC_ROUTES.concat(PRIVATE_ROUTES);

    return (
      <Switch>
        <Route exact path={routes.map((route) => route.path)}>
        <RenderRoutes routes={routes} />
        </Route>
        <Redirect from="*" to={DEFAULT_AUTHENTICATED_ROUTE} />
      </Switch>
  )
}))

const RootRouter = () => {
  const token = useSelector((state) => state.auth.token)||null;
  const baseName = process.env.REACT_APP_BASE_NAME;
  const isAuthenticated = true;
  const loading=useSelector((state)=>state.loading.loading);
  
  updateAuthToken(token);
  return (
    <BrowserRouter basename={baseName}>
      <Home_Loader visible={loading}>
      <DocumentTitle isAuthenticated={isAuthenticated} />
      {token ? <AuthenticatedRoutes /> : <GuestRoutes />}
      </Home_Loader>
    </BrowserRouter>
  );
};

export default RootRouter;
