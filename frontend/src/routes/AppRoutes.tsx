import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout, PrivateRoute, PublicRoute } from '../components/index';
import LoginPage from "../pages/Login.tsx";
import { privateRoutes } from './privateRoutes';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage/>} />
        </Route>
        <Route element={ <PrivateRoute />}>
          <Route element={ <Layout />}>
          {privateRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
