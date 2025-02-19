import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {RootLayout} from "./components/layout/RootLayout.tsx";
import {UserSignInPage} from "./pages/UserSignInPage.tsx";
import {UserSignUpPage} from "./pages/UserSignUpPage.tsx";
import {NotFoundPage} from "./pages/NotFoundPage.tsx";
import {DashboardPage} from "./pages/DashboardPage.tsx";
import {OTPVerificationPage} from "./pages/OTPVerificationPage.tsx";

function App() {

    const routes = createBrowserRouter([
        {
            path: '',
            element : <RootLayout/>,
            children : [
                { path: '', element: <Navigate to="/signin" replace /> },
                { path : '/signin', element : <UserSignInPage/>},
                { path : '/signup', element : <UserSignUpPage/>},
                { path : '/verify-otp', element : <OTPVerificationPage/> },
                { path : '/dashboard', element : <DashboardPage/>},
            ]
        },
        {
            path: "*",
            element: <NotFoundPage/>
        }
    ])

    return (
        <>
            <RouterProvider router={routes} />
        </>
    )
}

export default App
