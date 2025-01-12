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

export const DashboardPageLayout: React.FC<DashboardPageLayoutProps> = ({ children }) => {
    const router = DashboardRouterComponent('/dashboard');

    return (
        <AppProvider navigation={DashboardNavComponent} router={router} theme={DashboardThemeComponent} branding={{title: "WareXpert Management System", homeUrl:"/dashboard"}}>
            <DashboardLayout>
                <PageContainer>
                    {children}
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
};

