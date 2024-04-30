import HomePage from "./components/Homepage";
import DataComponent from "./components/Hello";
import Register from "./components/Account/Register";

const AppRoutes = [
    {
    index: true,
    element: <HomePage />
    },
    {
    path: '/data',
    element: < DataComponent />
    },
    {
    path: '/register',
    element: < Register />
    },
];

export default AppRoutes;