import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {RootLayoutComponent} from "./components/layout/RootLayoutComponent.tsx";
import {NotFoundComponent} from "./components/layout/NotFoundComponent.tsx";
import {UserSignInPage} from "./pages/UserSignInPage.tsx";
import {UserSignUpPage} from "./pages/UserSignUpPage.tsx";

function App() {

    const routes = createBrowserRouter([
        {
            path: '',
            element : <RootLayoutComponent/>,
            children : [
                { path: '', element: <Navigate to="/signin" replace /> },
                { path : '/signin', element : <UserSignInPage/>},
                { path : '/signup', element : <UserSignUpPage/>},
            ]
        },
        {
            path: "*",
            element: <NotFoundComponent/>
        }
    ])

    return (
        <>
            <RouterProvider router={routes} />
        </>
    )
}

export default App
