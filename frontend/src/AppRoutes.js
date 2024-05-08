import HomePage from "./components/Homepage";
import DataComponent from "./components/Hello";
import Register from "./components/Register";
import Login from "./components/Login";
import ChangePassword from "./components/Password";
import CreateLecture from "./components/CreateLecture";
import ChooseLecture from "./components/ChooseLecture";
import LectureView from "./components/LectureView";
import Question from "./components/Question";

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
    {
    path: '/login',
    element: < Login />
    },
    {
    path: '/passwd',
    element: < ChangePassword />
    },
    {
    path: '/codes',
    element: <CreateLecture />
    },
    {
    path: '/history',
    element: <ChooseLecture />
    },
    {
    path: '/notes/:code',
    element: <LectureView />
    },
    {
    path: '/question',
    element: <Question />
    },

];

export default AppRoutes;