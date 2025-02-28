import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import {DashboardRouterComponent} from "../dashboard/feature/DashboardRouterComponent.tsx";
import React, {ReactNode} from "react";
import {DashboardNavComponent} from "../dashboard/navigation/DashboardNavComponent.tsx";
import {DashboardThemeComponent} from "../dashboard/feature/DashboardThemeComponent.tsx";

interface DashboardPageLayoutProps {
    children: ReactNode;
}

export const DashboardPageLayout: React.FC<DashboardPageLayoutProps> = () => {
    const router = DashboardRouterComponent('/dashboard');

    return (
        <AppProvider navigation={DashboardNavComponent} router={router} theme={DashboardThemeComponent} branding={{title: "WareXpert Warehouse", homeUrl:"/dashboard"}}>
            <DashboardLayout>
                <PageContainer title="" sx={{'.MuiTypography-root': { display: 'none' },}}>
                    {router.Component}
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
};