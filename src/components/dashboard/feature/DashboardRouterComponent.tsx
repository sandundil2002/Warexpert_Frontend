import {useMemo, useState} from "react";
import {Router} from '@toolpad/core/AppProvider';

export function DashboardRouterComponent(initialPath: string): Router {
    const [pathname, setPathname] = useState(initialPath);

    return useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path: string | URL) => setPathname(String(path)),
        };
    }, [pathname]);
}
