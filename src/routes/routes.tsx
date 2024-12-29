import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Customers from "../pages/Customers";
import Sales from "../pages/Sales";
import Merchants from "../pages/Merchants";
import Users from "../pages/Users";
import Purchases from "../pages/Purchases";
import NotFound from "../pages/NotFound";
import Expenses from "../pages/Expenses";
import AddUser from "../pages/AddUser";
import AddOrder from "../pages/AddOrder";
import Login from "../pages/Login";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import AddExpense from "../pages/AddExpese";
import AddProduct from "../pages/AddProduct";
import OrderPage from "../pages/Order";
import PurchasePage from "../pages/Purchase";
import UpdateExpense from "../pages/UpdateExpense";
import UpdateOrder from "../pages/UpdateOrder";
import Merchant from "../pages/Merchant";
import UpdatePurchase from "../pages/UpdatePurchase";
import UpdateProduct from "../pages/UpdateProduct";
import UpdateUser from "../pages/UpdateUser";
import AddPurchase from "../pages/AddPurchase";
import NotAuthorized from "../pages/NotAuthorized";
import Customer from "../pages/Customer";
import Payments from "../pages/Payments";
import AddPayment from "../pages/AddPayment";
import UpdatePayment from "../pages/UpdatePayment";
import RouterGuard from "../utils/RouterGuard";


const router = createBrowserRouter([
    {
        path: "/", element: <Layout />, children: [
            { index: true, element: (<RouterGuard><Home /></RouterGuard>), },
            { path: "/customers", element: <RouterGuard><Customers /></RouterGuard> },
            { path: "/customers/:id", element: <RouterGuard><Customer /></RouterGuard> },
            { path: "/orders", element: <RouterGuard><Sales /></RouterGuard> },
            { path: "/orders/:id", element: <RouterGuard><OrderPage /></RouterGuard> },
            { path: "/orders/:id/update", element: <RouterGuard><UpdateOrder /></RouterGuard> },
            { path: "/orders/add", element: <RouterGuard><AddOrder /></RouterGuard> },
            { path: "/merchants", element: <RouterGuard><Merchants /></RouterGuard> },
            { path: "/merchants/:id", element: <RouterGuard><Merchant /></RouterGuard> },
            { path: "/expenses", element: <RouterGuard><Expenses /></RouterGuard> },
            { path: "/expenses/add", element: <RouterGuard><AddExpense /></RouterGuard> },
            { path: "/expenses/:id/update", element: <RouterGuard><UpdateExpense /></RouterGuard> },
            { path: "/purchases", element: <RouterGuard><Purchases /></RouterGuard> },
            { path: "/purchases/add", element: <RouterGuard><AddPurchase /></RouterGuard> },
            { path: "/purchases/:id", element: <RouterGuard><PurchasePage /></RouterGuard> },
            { path: "/purchases/:id/update", element: <RouterGuard><UpdatePurchase /></RouterGuard> },
            { path: "/payments", element: <RouterGuard><Payments /></RouterGuard> },
            { path: "/payments/add", element: <RouterGuard><AddPayment /></RouterGuard> },
            { path: "/payments/:id/update", element: <RouterGuard><UpdatePayment /></RouterGuard> },
            { path: "/products", element: <RouterGuard><Products /></RouterGuard> },
            { path: "/products/add", element: <RouterGuard><AddProduct /></RouterGuard> },
            { path: "/products/:id/update", element: <RouterGuard><UpdateProduct /></RouterGuard> },
            { path: "/categories", element: <RouterGuard><Categories /></RouterGuard> },
            { path: "/users", element: <RouterGuard><Users /></RouterGuard> },
            { path: "/users/add", element: <RouterGuard><AddUser /></RouterGuard> },
            { path: "/users/:id/update", element: <RouterGuard><UpdateUser /></RouterGuard> },
        ]
    },
    { path: "/login", element: <Login /> },
    { path: "/forget-password", element: <ForgetPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/not-authorized", element: <NotAuthorized /> },
    { path: "*", element: <NotFound /> },
])

export default router