import './App.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {RootLayoutComponent} from "./components/layout/RootLayoutComponent.tsx";
import {NotFoundComponent} from "./components/layout/NotFoundComponent.tsx";
import {SignupFormComponent} from "./components/authentication/SignupFormComponent.tsx";
import {SignInFormComponent} from "./components/authentication/SignInFormComponent.tsx";

function App() {

    const routes = createBrowserRouter([
        {
            path: '',
            element : <RootLayoutComponent/>,
            children : [
                { path: '', element: <Navigate to="/signin" replace /> },
                { path : '/signin', element : <SignInFormComponent/>},
                { path : '/signup', element : <SignupFormComponent/>},
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
