import HomePage from "./components/Homepage";
import Register from "./components/Register";
import Login from "./components/Login";
import ChangePassword from "./components/Password";
import History from "./components/History";
import LectureView from "./components/LectureView";
import Question from "./components/Question";

const AppRoutes = [
    {
    index: true,
    element: <HomePage />
    },
    {
    path: '/register',
    element: < Register />
    },
    {
    path: '/login',
    element: < Login />
    },
    {
    path: '/passwd',
    element: < ChangePassword />
    },
    {
    path: '/history',
    element: <History />
    },
    {
    path: '/notes/:id',
    element: <LectureView />
    },
    {
    path: '/question/:id',
    element: <Question />
    },

];

export default AppRoutes;