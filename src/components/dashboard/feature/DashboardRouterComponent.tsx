import {Component, ReactElement, useMemo, useState} from "react";
import {Router} from '@toolpad/core/AppProvider';
import {WarehousesPage} from "../../../pages/WarehousesPage.tsx";
import {NotFoundPage} from "../../../pages/NotFoundPage.tsx";
import {CustomerPage} from "../../../pages/CustomerPage.tsx";
import {InventoryPage} from "../../../pages/InventoryPage.tsx";
import {EmployeePage} from "../../../pages/EmployeePage.tsx";
import {LogsPage} from "../../../pages/LogsPage.tsx";
import {TransportationPage} from "../../../pages/TransportationPage.tsx";

type RouteConfig = {
    [path: string]: ReactElement;
};

export function DashboardRouterComponent(initialPath: string): Router  & { Component: ReactElement } {
    const [pathname, setPathname] = useState(initialPath);

    const routes: RouteConfig = {
        '/dashboard': <div>Dashboard</div>,
        '/warehouses': <WarehousesPage />,
        '/customers': <CustomerPage />,
        '/inventory': <InventoryPage />,
        '/employees': <EmployeePage />,
        '/logs': <LogsPage />,
        '/transportation': <TransportationPage />,
    };

    return useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path: string | URL) => setPathname(String(path)),
            Component: routes[pathname] || <NotFoundPage />,
        };
    }, [pathname, Component]);
}
