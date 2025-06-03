import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "../shared/components/Layouts/Layout";
import {
  Dashboard,
  ManagementScheduling,
  ManagementStudents,
  ManagementTeachers,
} from "../app/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard/students-management",
        element: <ManagementStudents />,
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard/students-scheduling",
        element: <ManagementScheduling />,
      },
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard/teachers-management",
        element: <ManagementTeachers />,
      },
    ],
  },
]);
