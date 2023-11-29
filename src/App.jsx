import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { fetchOptions } from "./redux/optionsSlice";
import Login from "./pages/Login/Login";
import Layout from "./components/Layout/Layout";
import Warehouse from "./pages/Warehouse/Warehouse";
import DistributorProfile from "./pages/DistributorProfile/DistributorProfile";
import Distributors from "./pages/Distributors/Distributors";
import EditDistributor from "./pages/EditDistributor/EditDistributor";
import EditProduct from "./pages/EditProduct/EditProduct";
import Archive from "./pages/Archive/Archive";
import Logout from "./pages/Logout/Logout";
import NotFound from "./pages/NotFound/NotFound";
import Transaction from "./pages/Transaction/Transaction";
import Warehouse_ from "./experimental_pages/ExperimentalWarehouse/Warehouse_";
import { PATHS } from "./common/constants";

const publicRoutes = (
  <>
    <Route path={PATHS.logIn} element={<Login />} />
    <Route path="*" element={<Navigate to={PATHS.logIn} />} />
  </>
);

const guestRoutes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to={PATHS.products} replace />} />

      <Route path={PATHS.products} element={<Warehouse />} />
      <Route path={PATHS.productsArchive} element={<Archive />} />

      <Route path={PATHS.distributors} element={<Distributors />} />
      <Route path={PATHS.distributorsArchive} element={<Archive />} />
    </Route>

    <Route path={PATHS.logIn} element={<Navigate to={PATHS.products} />} />
    <Route path={PATHS.logOut} element={<Logout />} />
    <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
    <Route path={PATHS.notFound} element={<NotFound />} />
  </>
);

const officerRoutes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route path="/table" element={<Warehouse_ />} />

      <Route index element={<Navigate to={PATHS.products} replace />} />

      <Route path={PATHS.products} element={<Warehouse />} />
      <Route path={PATHS.productsArchive} element={<Archive />} />
      <Route path={PATHS.productsCreate} element={<EditProduct />} />
      <Route path={PATHS.productsEdit + "/:id"} element={<EditProduct />} />

      <Route path={PATHS.distributors} element={<Distributors />} />
      <Route
        path={PATHS.distributorsProfile + "/:id"}
        element={<DistributorProfile />}
      />
      <Route
        path={PATHS.distributorsEdit + "/:id"}
        element={<EditDistributor />}
      />
      <Route path={PATHS.order + "/:id"} element={<Transaction />} />
      <Route path={PATHS.return + "/:id"} element={<Transaction />} />
      <Route path={PATHS.distributorsCreate} element={<EditDistributor />} />
      <Route path={PATHS.distributorsArchive} element={<Archive />} />
    </Route>

    <Route path={PATHS.logIn} element={<Navigate to={PATHS.products} />} />
    <Route path={PATHS.logOut} element={<Logout />} />
    <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
    <Route path={PATHS.notFound} element={<NotFound />} />
  </>
);

const directorRoutes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route path="/table" element={<Warehouse_ />} />

      <Route index element={<Navigate to={PATHS.products} replace />} />

      <Route path={PATHS.products} element={<Warehouse />} />
      <Route path={PATHS.productsArchive} element={<Archive />} />
      <Route path={PATHS.productsCreate} element={<EditProduct />} />
      <Route path={PATHS.productsEdit + "/:id"} element={<EditProduct />} />

      <Route path={PATHS.distributors} element={<Distributors />} />
      <Route
        path={PATHS.distributorsProfile + "/:id"}
        element={<DistributorProfile />}
      />
      <Route
        path={PATHS.distributorsEdit + "/:id"}
        element={<EditDistributor />}
      />
      <Route path={PATHS.order + "/:id"} element={<Transaction />} />
      <Route path={PATHS.return + "/:id"} element={<Transaction />} />
      <Route path={PATHS.distributorsCreate} element={<EditDistributor />} />
      <Route path={PATHS.distributorsArchive} element={<Archive />} />
    </Route>

    <Route path={PATHS.logIn} element={<Navigate to={PATHS.products} />} />
    <Route path={PATHS.logOut} element={<Logout />} />
    <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
    <Route path={PATHS.notFound} element={<NotFound />} />
  </>
);

export default function App() {
  const { user } = useSelector((state) => state.auth);

  function getUserRoutes(user) {
    switch (user) {
      case "Директор":
        return directorRoutes;
      case "Завсклад":
        return officerRoutes;
      case "Гость":
        return guestRoutes;

      default:
        return publicRoutes;
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        draggable={false}
      />
      <Routes>{getUserRoutes(user)}</Routes>
    </>
  );
}
