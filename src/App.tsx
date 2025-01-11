import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RootLayoutComponent} from "./components/layout/RootLayoutComponent.tsx";
import {NotFoundComponent} from "./components/layout/NotFoundComponent.tsx";

function App() {

    const routes = createBrowserRouter([
        {
            path: '',
            element : <RootLayoutComponent/>,
            children : [
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
