import { Outlet } from "react-router";
import { Header } from "../Header/Header";

export const Layout = () => {
  return (
    <>
      <Header />
      <main style={{ marginTop: "80px" }}>
        <Outlet />
      </main>
    </>
  );
};
