import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
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

const publicRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<Navigate to="/login" />} />
  </>
);

const privateRoutes = (
  <>
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/warehouse" replace />} />
      {/* temporary table route */}
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
);

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
      <Routes>{user ? privateRoutes : publicRoutes}</Routes>
    </>
  );
}
