import { createBrowserRouter } from "react-router";
import Login from "@/pages/Login/Login"
import Sign from "@/pages/Sign/Sign"
import User from "@/pages/User/User"
import User1 from "@/pages/User1/User1";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>,
    },
    {
        path: "/sign",
        element: <Sign/>,
    },
    {
        path: "/user",
        element: <User/>,
    },
    {
        path: "/user1",
        element: <User1/>,
    }
])

export default router;