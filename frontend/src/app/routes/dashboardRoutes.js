import React from "react";
import MiscDashboard from "../pages/dashboards/misc/MiscDashboard";
import Page from "@jumbo/shared/Page";
import ProtectedRoute from "app/shared/customComponents/ProtectedRoute";
import GovUsersTable from "app/shared/customComponents/GovUserTable/GovUsersTable";
import DistrictUserTable from "app/shared/customComponents/DistrictUserTable/DistrictUsersTable";
import FillingCreate from "app/shared/customComponents/Filling/FillingCreate";
import FillingHistoryTable from "app/shared/customComponents/FillingHistory/FillingHistoryTable";
import CaseHistoryTable from "app/shared/customComponents/CaseHistory/CaseHistoryTable";
import NmsAdd from "app/shared/customComponents/Nms/NmsAdd";
import NmsUsersTable from "app/shared/customComponents/Nms/NmsUsersTable";
import NmsEdit from "app/shared/customComponents/Nms/NmsEdit";
import CaseManagerUsersTable from "app/shared/customComponents/CaseManagerUserTable/CaseManagerUsersTable";
import NeutralUserTable from "app/shared/customComponents/NeutralUserTable/NeutralUsersTable";
import CaseView from "app/shared/customComponents/CaseView";
const dashboardRoutes = [
  {
    path: "/",
    element: (
        <ProtectedRoute
          route={{
            roles: [
              "SUPER_ADMIN",
              "GOVT_ADMIN",
              "DISTRICT_ADMIN",
              "NEUTRAL",
              "CASE_MANAGER",
            ],
          }}
        >
      <Page component={MiscDashboard} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
        <ProtectedRoute
          route={{
            roles: [
              "SUPER_ADMIN",
              "GOVT_ADMIN",
              "DISTRICT_ADMIN",
              "NEUTRAL",
              "CASE_MANAGER",
            ],
          }}
        >
      <Page component={MiscDashboard} />
        </ProtectedRoute>
    ),
  },
  {
    path: "/users/government",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN"],
        }}
      >
        <Page component={GovUsersTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/district",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN", "GOVT_ADMIN"],
        }}
      >
        <Page component={DistrictUserTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/casemanager",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN"],
        }}
      >
        <Page component={CaseManagerUsersTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/neutral",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN"],
        }}
      >
        <Page component={NeutralUserTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/filling/create",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN", "GOVT_ADMIN", "DISTRICT_ADMIN"],
        }}
      >
        <Page component={FillingCreate}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/filling/listing",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN", "GOVT_ADMIN", "DISTRICT_ADMIN"],
        }}
      >
        <Page component={FillingHistoryTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/case/create",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN"],
        }}
      >
        <Page component={FillingCreate}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/listing/:caseType",
    element: (
      <ProtectedRoute
        route={{
          roles: [
            "SUPER_ADMIN",
            "GOVT_ADMIN",
            "DISTRICT_ADMIN",
            "CASE_MANAGER",
            "NEUTRAL",
          ],
        }}
      >
        <Page component={CaseHistoryTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/view/:id",
    element: (
      <ProtectedRoute
        route={{
          roles: [
            "SUPER_ADMIN",
            "GOVT_ADMIN",
            "DISTRICT_ADMIN",
            "NEUTRAL",
            "CASE_MANAGER",
          ],
        }}
      >
        <Page component={CaseView}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/nms/create",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN", "GOVT_ADMIN", "DISTRICT_ADMIN"],
        }}
      >
        <Page component={NmsAdd}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/nms/listing",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN", "GOVT_ADMIN", "DISTRICT_ADMIN"],
        }}
      >
        <Page component={NmsUsersTable}></Page>
      </ProtectedRoute>
    ),
  },
  {
    path: "/nms/edit/:id",
    element: (
      <ProtectedRoute
        route={{
          roles: ["SUPER_ADMIN", "GOVT_ADMIN", "DISTRICT_ADMIN"],
        }}
      >
        <Page component={NmsEdit}></Page>
      </ProtectedRoute>
    ),
  },
];

export default dashboardRoutes;
