import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import usePermissions from "./hooks/usePermissions";
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
import { PATHS } from "./common/constants";
import DirectorOrOfficer from "./components/Routing/DirectorOrOfficer";
import DirectorOnly from "./components/Routing/DirectorOnly";
import { useEffect } from "react";
import { fetchOptions } from "./redux/optionsSlice";

const publicRoutes = (
  <>
    <Route path={PATHS.logIn} element={<Login />} />
    <Route path="*" element={<Navigate to={PATHS.logIn} />} />
  </>
);

const privateRoutes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to={PATHS.products} replace />} />
      <Route path={PATHS.products} element={<Warehouse />} />
      <Route path={PATHS.distributors} element={<Distributors />} />
      <Route path={PATHS.productsArchive} element={<Archive />} />
      <Route path={PATHS.distributorsArchive} element={<Archive />} />
      <Route
        path={PATHS.distributorsProfile + "/:id"}
        element={<DistributorProfile />}
      />

      <Route
        path={PATHS.productsCreate}
        element={
          <DirectorOrOfficer>
            <EditProduct />
          </DirectorOrOfficer>
        }
      />
      <Route
        path={PATHS.order + "/:id"}
        element={
          <DirectorOrOfficer>
            <Transaction />
          </DirectorOrOfficer>
        }
      />
      <Route
        path={PATHS.return + "/:id"}
        element={
          <DirectorOrOfficer>
            <Transaction />
          </DirectorOrOfficer>
        }
      />
      <Route
        path={PATHS.productsEdit + "/:id"}
        element={
          <DirectorOnly>
            <EditProduct />
          </DirectorOnly>
        }
      />
      <Route
        path={PATHS.distributorsEdit + "/:id"}
        element={
          <DirectorOnly>
            <EditDistributor />
          </DirectorOnly>
        }
      />
      <Route
        path={PATHS.distributorsCreate}
        element={
          <DirectorOnly>
            <EditDistributor />
          </DirectorOnly>
        }
      />
    </Route>

    <Route path={PATHS.logIn} element={<Navigate to={PATHS.products} />} />
    <Route path={PATHS.logOut} element={<Logout />} />
    <Route path="*" element={<Navigate to={PATHS.notFound} replace />} />
    <Route path={PATHS.notFound} element={<NotFound />} />
  </>
);

export default function App() {
  const { isUserLoggedIn } = usePermissions();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOptions());
  }, [isUserLoggedIn]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        draggable={false}
      />
      <Routes>{isUserLoggedIn ? privateRoutes : publicRoutes}</Routes>
    </>
  );
}
