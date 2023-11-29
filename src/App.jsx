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

const privateRoutes = (
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
/* const privateRoutes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/warehouse" replace />} />

      <Route path="/table" element={<Warehouse_ />} />

      <Route path="warehouse" element={<Outlet />}>
        <Route index element={<Warehouse />} />
        <Route path="archive" element={<Archive />} />
        <Route path="create" element={<EditProduct />} />
        <Route path="edit/:id" element={<EditProduct />} />
      </Route>
      <Route path="distributors" element={<Outlet />}>
        <Route index element={<Distributors />} />
        <Route path="profile/:id" element={<DistributorProfile />} />
        <Route path="edit/:id" element={<EditDistributor />} />
        <Route path="order/:id" element={<Transaction />} />
        <Route path="return/:id" element={<Transaction />} />
        <Route path="create" element={<EditDistributor />} />
        <Route path="archive" element={<Archive />} />
      </Route>
    </Route>
    <Route path="/login" element={<Navigate to="/warehouse" />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="*" element={<Navigate to="/not-found" replace />} />
    <Route path="/not-found" element={<NotFound />} />
  </>
); */

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchOptions());
    }
  }, [user, dispatch]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        draggable={false}
      />
      <Routes>{user ? privateRoutes : publicRoutes}</Routes>
    </>
  );
}
